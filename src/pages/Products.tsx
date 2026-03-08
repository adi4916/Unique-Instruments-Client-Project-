import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { getDatabase, ref, get } from "firebase/database";
import { db } from '../firebase';
import { Plus, Search, X } from 'lucide-react';
import { PrivateRoute } from '../PrivateRoute';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import quoatationbg from "../img/U (1).png";


interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  userId: string;
}

interface QuotationItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

interface ProductsContentProps {
  searchTerm: string;
}

const ProductsContent: React.FC<ProductsContentProps> = ({ searchTerm }) => {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productSearch, setProductSearch] = useState('');
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const [quotationItems, setQuotationItems] = useState<QuotationItem[]>([]);
  const [quotationForm, setQuotationForm] = useState({
    quotationNumber: '',
    clientName: '',
    clientAddress: '',
    preparedBy: '',
    bankDetails: '',
  });
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
  });
  const [addingProduct, setAddingProduct] = useState(false);

  // const fetchProducts = async () => {
  //   if (!currentUser) return;
  //   try {
  //     const q = query(
  //       collection(db, 'product_catalog'),
  //       where('userId', '==', currentUser.uid)
  //     );
  //     const snapshot = await getDocs(q);
  //     const items: Product[] = [];
  //     snapshot.forEach((docSnap) => {
  //       items.push({
  //         id: docSnap.id,
  //         ...(docSnap.data() as Omit<Product, 'id'>),
  //       });
  //     });
  //     setProducts(items);
  //   } catch (err) {
  //     console.error('Error fetching products:', err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchProducts = async () => {
    try {
      const database = getDatabase();
  
      const snapshot = await get(ref(database, "product_catalog"));
  
      const items: Product[] = [];
  
      if (snapshot.exists()) {
        const data = snapshot.val();
  
        Object.keys(data).forEach((key) => {
          const product = data[key];
  
          items.push({
            id: key,
            name: product.name,
            description: product.description || "",
            price: product.price || 0,
            userId: "", // not used but required by your interface
          });
        });
      }
  
      setProducts(items);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentUser]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setAddingProduct(true);
    try {
      await addDoc(collection(db, 'products'), {
        ...newProduct,
        userId: currentUser.uid,
        createdAt: new Date().toISOString(),
      });
      setNewProduct({ name: '', description: '', price: 0 });
      setAddProductModalOpen(false);
      await fetchProducts();
    } catch (err) {
      console.error('Error adding product:', err);
    } finally {
      setAddingProduct(false);
    }
  };

const generatePDF = () => {

    const doc = new jsPDF();

    // background image
    doc.addImage(quoatationbg, "PNG", 0, 0, 210, 297);

    const today = new Date().toLocaleDateString();

    // Client info
    doc.setFontSize(11);

    doc.text(`Date : ${today}`, 15, 70);

    doc.text("To,", 15, 80);
    doc.text(quotationForm.clientName, 15, 88);
    doc.text(quotationForm.clientAddress, 15, 96);

    doc.text("Sir,", 15, 110);

    doc.text(
      "With reference to your enquiry no verbal, we submit our lowest quote.",
      15,
      118
    );

    // Table data
    const tableRows = quotationItems.map((item, index) => [
      index + 1,
      item.productName,
      item.quantity,
      `${item.price.toFixed(2)} Rs`,
      `${(item.price * item.quantity).toFixed(2)} Rs`,
    ]);

    const grandTotal = quotationItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    autoTable(doc, {
      startY: 125,
      head: [["Sr No", "Description", "Qty", "Rate", "Total"]],
      body: tableRows,
      theme: "grid",
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;

    doc.text(`Grand Total : ${grandTotal.toFixed(2)} Rs`, 140, finalY);

    // Terms
    doc.text("Terms and condition:", 15, finalY + 15);

    doc.text(
      "Delivery: delivery will be done to your site. Unloading and installation (civil work) should be carried by you.",
      15,
      finalY + 22,
      { maxWidth: 180 }
    );

    doc.text(
      "Commissioning and calibration will be carried by us on site.",
      15,
      finalY + 30
    );

    doc.text("IGST : 18% Extra.", 15, finalY + 38);

    doc.text("Payment: 100% advance with order.", 15, finalY + 46);

    doc.text(
      `Bank Details: ${quotationForm.bankDetails}`,
      15,
      finalY + 54,
      { maxWidth: 180 }
    );

    doc.text("Thanking you,", 15, finalY + 70);

    doc.text("For UNIQUE INSTRUMENTS", 15, finalY + 78);

    doc.save(`quotation-${quotationForm.quotationNumber}.pdf`);
  };
  const handleAddToQuotation = (product: Product) => {
    const existing = quotationItems.find((i) => i.productId === product.id);
    if (existing) {
      setQuotationItems(
        quotationItems.map((i) =>
          i.productId === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );
    } else {
      setQuotationItems([
        ...quotationItems,
        {
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity: 1,
        },
      ]);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes((productSearch || searchTerm || '').toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 mt-16 max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Quotation Generator
          </h1>
          <p className="text-gray-600 mb-4">
            Browse products and generate quotations for your clients
          </p>

          <div className="relative mb-4">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={productSearch || searchTerm}
              onChange={(e) => setProductSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                    PRICE
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                    ADD
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                      No products found
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => {
                    const qty = quotationItems.find((i) => i.productId === product.id)?.quantity;
                    return (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-800">{product.name}</td>
                        <td className="px-4 py-3 text-gray-600">₹{product.price}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleAddToQuotation(product)}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                          >
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                              <Plus size={16} strokeWidth={3} />
                            </span>
                            {qty !== undefined && qty > 0 && (
                              <span className="text-sm font-medium">{qty}</span>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* quotation builder */}
        <div className="lg:w-96 bg-white rounded-lg shadow-md p-6 flex-shrink-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Quotation Builder
            </h2>
            <button
              onClick={() => setAddProductModalOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Add Item
            </button>
          </div>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quotation Number <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={quotationForm.quotationNumber}
                onChange={(e) =>
                  setQuotationForm({ ...quotationForm, quotationNumber: e.target.value })
                }
                placeholder="e.g., UIG/254/2025"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={quotationForm.clientName}
                onChange={(e) =>
                  setQuotationForm({ ...quotationForm, clientName: e.target.value })
                }
                placeholder="Client name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Address
              </label>
              <textarea
                value={quotationForm.clientAddress}
                onChange={(e) =>
                  setQuotationForm({ ...quotationForm, clientAddress: e.target.value })
                }
                placeholder="Client address"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 resize-y"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prepared By
              </label>
              <input
                type="text"
                value={quotationForm.preparedBy}
                onChange={(e) =>
                  setQuotationForm({ ...quotationForm, preparedBy: e.target.value })
                }
                placeholder="Name of person preparing quotation"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bank Details
              </label>
              <textarea
                value={quotationForm.bankDetails}
                onChange={(e) =>
                  setQuotationForm({ ...quotationForm, bankDetails: e.target.value })
                }
                placeholder="Bank account details"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 resize-y"
              />
            </div>
          </form>

  {quotationItems.length > 0 && (
  <div className="mt-6 pt-4 border-t">

    <div className="flex justify-between items-center mb-3">
      <h3 className="font-semibold text-gray-700">
        Selected Items ({quotationItems.length})
      </h3>

      <button
        onClick={() => setQuotationItems([])}
        className="text-red-500 text-sm hover:underline"
      >
        Clear All
      </button>
    </div>

    {quotationItems.map((item, index) => {
      const total = item.price * item.quantity;

      return (
        <div
          key={item.productId}
          className="border rounded-lg p-4 mb-3 bg-gray-50"
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-gray-800">
              {item.productName}
            </h4>

            <button
              onClick={() =>
                setQuotationItems(
                  quotationItems.filter((i) => i.productId !== item.productId)
                )
              }
              className="text-red-500 text-lg"
            >
              -
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500">
                Quantity
              </label>

              <input
                type="number"
                value={item.quantity}
                onChange={(e) => {
                  const qty = parseInt(e.target.value) || 0;

                  const updated = [...quotationItems];
                  updated[index].quantity = qty;

                  setQuotationItems(updated);
                }}
                className="w-full border rounded px-2 py-1"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500">
                Rate (₹)
              </label>

              <input
                type="number"
                value={item.price}
                onChange={(e) => {
                  const price = parseFloat(e.target.value) || 0;

                  const updated = [...quotationItems];
                  updated[index].price = price;

                  setQuotationItems(updated);
                }}
                className="w-full border rounded px-2 py-1"
              />
            </div>
          </div>

                  <div className="flex justify-between items-center mt-3">
                    <button
                      onClick={() => setQuotationItems([...quotationItems])}
                      className="bg-green-600 text-white text-sm px-3 py-1 rounded"
                    >
                      Update
                    </button>

                    <span className="text-sm font-medium">
                      Total: ₹{total.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}

            <div className="flex justify-between font-semibold mt-4">
              <span>Grand Total:</span>

              <span className="text-blue-600">
                ₹
                {quotationItems
                  .reduce((sum, item) => sum + item.price * item.quantity, 0)
                  .toFixed(2)}
              </span>
            </div>

            <button
              onClick={generatePDF}
              className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white py-2 rounded flex items-center justify-center gap-2"
            >
              Generate PDF
            </button>
          </div>
        )}
        </div>
      </div>

      {addProductModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Add New Product</h3>
              <button
                onClick={() => setAddProductModalOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="Enter product name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, description: e.target.value })
                  }
                  placeholder="Enter description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 resize-y"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₹)
                </label>
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  min={0}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <button
                type="submit"
                disabled={addingProduct}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {addingProduct ? 'Adding...' : 'Add Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const Products: React.FC<ProductsContentProps> = (props) => (
  <PrivateRoute>
    <ProductsContent {...props} />
  </PrivateRoute>
);

export default Products;
