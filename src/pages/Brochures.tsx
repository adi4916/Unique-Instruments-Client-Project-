import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  collection,
  addDoc,
  query,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage } from '../firebase';
import { FileUp, Download, Trash2, File } from 'lucide-react';

interface Brochure {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  storagePath?: string;
  fileName: string;
  uploadDate: string;
  fileType: string;
}

const Brochures = () => {
  const { currentUser } = useAuth();
  const [brochures, setBrochures] = useState<Brochure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newBrochure, setNewBrochure] = useState({
    title: '',
    description: '',
  });

  const fetchBrochures = async () => {
    try {
      const q = query(
        collection(db, 'brochures'),
        orderBy('uploadDate', 'desc')
      );
      const snapshot = await getDocs(q);
      const fetched: Brochure[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        fetched.push({
          id: docSnap.id,
          ...data,
          storagePath: data.storagePath,
        } as Brochure);
      });
      setBrochures(fetched);
    } catch (err) {
      console.error('Error fetching brochures:', err);
      setError('Failed to fetch brochures');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrochures();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    if (!file.type.includes('pdf')) {
      setError('Please upload only PDF files');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File size should be less than 10MB');
      return;
    }
    setSelectedFile(file);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !selectedFile || !newBrochure.title.trim()) {
      setError('Please provide a title');
      return;
    }

    try {
      setUploading(true);
      setError('');

      const fileName = `${Date.now()}-${selectedFile.name}`;
      const storagePath = `brochures/${fileName}`;
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, selectedFile);
      const downloadUrl = await getDownloadURL(storageRef);

      await addDoc(collection(db, 'brochures'), {
        title: newBrochure.title,
        description: newBrochure.description,
        fileUrl: downloadUrl,
        storagePath,
        fileName: selectedFile.name,
        uploadDate: new Date().toISOString(),
        fileType: selectedFile.type,
      });

      setNewBrochure({ title: '', description: '' });
      setSelectedFile(null);
      setShowUploadForm(false);
      await fetchBrochures();
    } catch (err) {
      console.error('Error uploading brochure:', err);
      setError('Failed to upload brochure');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (brochure: Brochure) => {
    if (!currentUser || !window.confirm('Are you sure you want to delete this brochure?'))
      return;
    try {
      if (brochure.storagePath) {
        const storageRef = ref(storage, brochure.storagePath);
        await deleteObject(storageRef);
      }
      await deleteDoc(doc(db, 'brochures', brochure.id));
      setBrochures(brochures.filter((b) => b.id !== brochure.id));
    } catch (err) {
      console.error('Error deleting brochure:', err);
      setError('Failed to delete brochure');
    }
  };

  if (loading) {
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
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Product Catalog</h1>
            <p className="text-gray-600 mt-2">
              Browse our collection of musical instruments and equipment
            </p>
          </div>
          {currentUser && (
            <button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-md"
            >
              <FileUp size={20} className="mr-2" />
              {showUploadForm ? 'Cancel' : 'Add Brochure'}
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            {error}
          </div>
        )}

        {currentUser && showUploadForm && (
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Add New Brochure
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newBrochure.title}
                  onChange={(e) =>
                    setNewBrochure({ ...newBrochure, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Description
                </label>
                <textarea
                  value={newBrochure.description}
                  onChange={(e) =>
                    setNewBrochure({ ...newBrochure, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  PDF File
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="brochure-upload"
                />
                <div className="flex items-center">
                  <label
                    htmlFor="brochure-upload"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md cursor-pointer"
                  >
                    <FileUp size={20} className="mr-2" />
                    Select PDF
                  </label>
                  {selectedFile && (
                    <span className="ml-3 text-sm text-gray-600">
                      {selectedFile.name}
                    </span>
                  )}
                </div>
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={uploading || !selectedFile}
                  className={`inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-md ${
                    uploading || !selectedFile ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    'Upload Brochure'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brochures.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              No brochures available at the moment
            </div>
          ) : (
            brochures.map((brochure) => (
              <div
                key={brochure.id}
                className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center text-red-600">
                      <File size={24} className="mr-2" />
                      <h3 className="font-semibold text-lg">{brochure.title}</h3>
                    </div>
                    {currentUser && (
                      <button
                        onClick={() => handleDelete(brochure)}
                        className="text-gray-400 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{brochure.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {new Date(brochure.uploadDate).toLocaleDateString()}
                    </span>
                    <a
                      href={brochure.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                    >
                      <Download size={16} className="mr-1" />
                      Download PDF
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Brochures;
