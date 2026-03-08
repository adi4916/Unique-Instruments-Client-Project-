import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import * as XLSX from 'xlsx';
import { Search,Plus, Trash2, Edit2, Save, X, FileDown, Eye } from 'lucide-react';
import AuthStatus from '../contexts/AuthStatus';

interface NewInventoryItem {
  name: string;
  quantity: number;
  price: number;
  description: string;
}

interface InventoryVariant {
  id: string;
  name: string;
  quantity: number;
}

interface StoredInventoryItem extends NewInventoryItem {
  id: string;
  userId: string;
  createdAt?: string;
}

interface InventoryProps {
  searchTerm: string;
}

const Inventory: React.FC<InventoryProps> = ({ searchTerm }) => {
  const { currentUser } = useAuth();
  const [items, setItems] = useState<StoredInventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<StoredInventoryItem | null>(null);

  const [newItem, setNewItem] = useState<NewInventoryItem>({
    name: '',
    quantity: 0,
    price: 0,
    description: '',
  });

  const [addVariantModal, setAddVariantModal] = useState<{
    isOpen: boolean;
    itemId: string | null;
    itemName: string;
  }>({ isOpen: false, itemId: null, itemName: '' });
  const [newVariant, setNewVariant] = useState({ name: '', quantity: 0 });

  const [viewVariantsModal, setViewVariantsModal] = useState<{
    isOpen: boolean;
    itemId: string | null;
    itemName: string;
    variants: InventoryVariant[];
  }>({ isOpen: false, itemId: null, itemName: '', variants: [] });

  const [variantCounts, setVariantCounts] = useState<Record<string, number>>({});

  // const fetchItems = async () => {
  //   if (!currentUser) return;
  
  //   try {
  //     const q = query(
  //       collection(db, "inventory"),
  //       where("userId", "==", currentUser.uid)
  //     );
  
  //     const snapshot = await getDocs(q);
  
  //     const fetchedItems: StoredInventoryItem[] = [];
  //     const counts: Record<string, number> = {};
  
  //     for (const docSnap of snapshot.docs) {
  //       const data = docSnap.data();
  
  //       fetchedItems.push({
  //         id: docSnap.id,
  //         ...(data as Omit<StoredInventoryItem, "id">),
  //       });
  
  //       const variantsSnap = await getDocs(
  //         collection(db, "inventory", docSnap.id, "variants")
  //       );
  
  //       counts[docSnap.id] = variantsSnap.size;
  //     }
  
  //     console.log(fetchedItems);
  //     setItems(fetchedItems);
  //     setVariantCounts(counts);
  //   } catch (err) {
  //     console.error("Error fetching items:", err);
  //     setError("Failed to fetch inventory items");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchItems = async () => {
    if (!currentUser) return;
  
    try {
      const q = query(
        collection(db, "inventory"),
        where("userId", "==", currentUser.uid)
      );
  
      const snapshot = await getDocs(q);
  
      const fetchedItems: StoredInventoryItem[] = [];
      const counts: Record<string, number> = {};
  
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
  
        fetchedItems.push({
          id: docSnap.id,
          ...(data as Omit<StoredInventoryItem, "id">),
        });
  
        // your variants are stored as a field, not subcollection
        counts[docSnap.id] = data.variants ? data.variants.length : 0;
      });
  
      setItems(fetchedItems);
      setVariantCounts(counts);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch inventory items");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchItems();
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (!currentUser) return;
    try {
      await addDoc(collection(db, 'inventory'), {
        ...newItem,
        userId: currentUser.uid,
        createdAt: new Date().toISOString(),
      });
      setNewItem({ name: '', quantity: 0, price: 0, description: '' });
      await fetchItems();
    } catch (err) {
      console.error('Error adding item:', err);
      setError('Failed to add item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const variantsRef = collection(db, 'inventory', id, 'variants');
        const variantsSnap = await getDocs(variantsRef);
        for (const v of variantsSnap.docs) {
          await deleteDoc(doc(db, 'inventory', id, 'variants', v.id));
        }
        await deleteDoc(doc(db, 'inventory', id));
        setItems(items.filter((i) => i.id !== id));
      } catch (err) {
        setError('Failed to delete item');
      }
    }
  };

  const handleEdit = (item: StoredInventoryItem) => {
    setEditingId(item.id);
    setEditingItem(item);
  };

  const handleSave = async (id: string) => {
    if (!editingItem) return;
    try {
      await updateDoc(doc(db, 'inventory', id), {
        name: editingItem.name,
        quantity: editingItem.quantity,
        price: editingItem.price,
        description: editingItem.description,
      });
      setItems(items.map((i) => (i.id === id ? { ...i, ...editingItem } : i)));
      setEditingId(null);
      setEditingItem(null);
    } catch (err) {
      setError('Failed to update item');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingItem(null);
  };

  const handleOpenAddVariant = (item: StoredInventoryItem) => {
    setAddVariantModal({
      isOpen: true,
      itemId: item.id,
      itemName: item.name,
    });
    setNewVariant({ name: '', quantity: 0 });
  };

  const handleAddVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addVariantModal.itemId) return;
    try {
      await addDoc(
        collection(db, 'inventory', addVariantModal.itemId, 'variants'),
        newVariant
      );
      setVariantCounts((prev) => ({
        ...prev,
        [addVariantModal.itemId!]: (prev[addVariantModal.itemId!] || 0) + 1,
      }));
      setAddVariantModal({ isOpen: false, itemId: null, itemName: '' });
      setNewVariant({ name: '', quantity: 0 });
    } catch (err) {
      setError('Failed to add variant');
    }
  };

  const handleOpenViewVariants = async (item: StoredInventoryItem) => {
    const variantsSnap = await getDocs(
      collection(db, 'inventory', item.id, 'variants')
    );
    const variants: InventoryVariant[] = [];
    variantsSnap.forEach((d) => {
      variants.push({ id: d.id, ...(d.data() as Omit<InventoryVariant, 'id'>) });
    });
    setViewVariantsModal({
      isOpen: true,
      itemId: item.id,
      itemName: item.name,
      variants,
    });
  };

  const handleExportToExcel = () => {
    const exportData = items.map((item) => ({
      'Item Name': item.name,
      Quantity: item.quantity,
      'Price (₹)': `₹${item.price.toFixed(2)}`,
      Description: item.description,
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventory');
    XLSX.writeFile(
      wb,
      `inventory-${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`
    );
  };

  const filteredItems = items.filter(
    (item) =>
      !searchTerm ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.price.toString().includes(searchTerm) ||
      item.quantity.toString().includes(searchTerm)
  );

  if (loading && items.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Inventory Management
          </h1>
          <button
            onClick={handleExportToExcel}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md flex items-center gap-2"
          >
            <FileDown size={20} />
            Export to Excel
          </button>
        </div>

        <AuthStatus className="mb-4" />

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            {error}
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Add New Item
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Item Name
                </label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Price (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newItem.price}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  min={0}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      quantity: parseInt(e.target.value) || 0,
                    })
                  }
                  min={0}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Description
                </label>
                <textarea
                  value={newItem.description}
                  onChange={(e) =>
                    setNewItem({ ...newItem, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 resize-y"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md flex items-center gap-2 disabled:opacity-50"
            >
              <Plus size={20} />
              Add Item
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Current Inventory
          </h2>
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NAME
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    QUANTITY
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PRICE
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    DESCRIPTION
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No items found
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        {editingId === item.id ? (
                          <input
                            type="text"
                            value={editingItem?.name}
                            onChange={(e) =>
                              setEditingItem((p) =>
                                p ? { ...p, name: e.target.value } : null
                              )
                            }
                            className="w-full px-2 py-1 border rounded"
                          />
                        ) : (
                          item.name
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingId === item.id ? (
                          <input
                            type="number"
                            value={editingItem?.quantity}
                            onChange={(e) =>
                              setEditingItem((p) =>
                                p
                                  ? {
                                      ...p,
                                      quantity: parseInt(e.target.value) || 0,
                                    }
                                  : null
                              )
                            }
                            min={0}
                            className="w-20 px-2 py-1 border rounded"
                          />
                        ) : (
                          item.quantity
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingId === item.id ? (
                          <input
                            type="number"
                            step="0.01"
                            value={editingItem?.price}
                            onChange={(e) =>
                              setEditingItem((p) =>
                                p
                                  ? {
                                      ...p,
                                      price: parseFloat(e.target.value) || 0,
                                    }
                                  : null
                              )
                            }
                            min={0}
                            className="w-24 px-2 py-1 border rounded"
                          />
                        ) : (
                          `₹${item.price.toFixed(2)}`
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingId === item.id ? (
                          <input
                            type="text"
                            value={editingItem?.description}
                            onChange={(e) =>
                              setEditingItem((p) =>
                                p ? { ...p, description: e.target.value } : null
                              )
                            }
                            className="w-full px-2 py-1 border rounded"
                          />
                        ) : (
                          item.description
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap items-center gap-2">
                          {editingId === item.id ? (
                            <>
                              <button
                                onClick={() => handleSave(item.id)}
                                className="text-green-600 hover:text-green-800"
                                title="Save"
                              >
                                <Save size={18} />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="text-gray-600 hover:text-gray-800"
                                title="Cancel"
                              >
                                <X size={18} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEdit(item)}
                                className="text-gray-600 hover:text-gray-800"
                                title="Edit"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="text-red-600 hover:text-red-800"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                              <button
                                onClick={() => handleOpenAddVariant(item)}
                                className="bg-purple-600 hover:bg-purple-700 text-white text-sm py-1.5 px-2 rounded flex items-center gap-1"
                              >
                                <Plus size={14} />
                                Add Variant
                              </button>
                              {(variantCounts[item.id] || 0) > 0 && (
                                <button
                                  onClick={() => handleOpenViewVariants(item)}
                                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm py-1.5 px-2 rounded flex items-center gap-1"
                                >
                                  <Eye size={14} />
                                  View Variants ({variantCounts[item.id] || 0})
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {addVariantModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Add Variant to {addVariantModal.itemName}
            </h3>
            <form onSubmit={handleAddVariant} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Variant Name
                </label>
                <input
                  type="text"
                  value={newVariant.name}
                  onChange={(e) =>
                    setNewVariant({ ...newVariant, name: e.target.value })
                  }
                  placeholder="e.g., Size, Color"
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  value={newVariant.quantity}
                  onChange={(e) =>
                    setNewVariant({
                      ...newVariant,
                      quantity: parseInt(e.target.value) || 0,
                    })
                  }
                  min={0}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setAddVariantModal({
                      isOpen: false,
                      itemId: null,
                      itemName: '',
                    })
                  }
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Add Variant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewVariantsModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Variants: {viewVariantsModal.itemName}
              </h3>
              <button
                onClick={() =>
                  setViewVariantsModal({
                    isOpen: false,
                    itemId: null,
                    itemName: '',
                    variants: [],
                  })
                }
                className="p-2 hover:bg-gray-100 rounded"
              >
                <X size={24} />
              </button>
            </div>
            <ul className="space-y-2">
              {viewVariantsModal.variants.map((v) => (
                <li
                  key={v.id}
                  className="flex justify-between py-2 border-b last:border-0"
                >
                  <span>{v.name}</span>
                  <span className="text-gray-600">Qty: {v.quantity}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
