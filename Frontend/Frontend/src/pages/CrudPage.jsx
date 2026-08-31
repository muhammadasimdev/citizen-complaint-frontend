import React, { useState, useEffect } from 'react';
import { crudService } from '../services/crudService';
import { appConfig } from '../config/appConfig';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Model';
import { Plus, Edit2, Trash2, Search, Loader2 } from 'lucide-react';

export default function CrudPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', category: '', status: 'Active', value: '' });

  const { addToast } = useToast();

  const fetchItems = async () => {
    setLoading(true);
    const res = await crudService.getItems();
    if (res.data) setItems(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpenModal = (item = null) => {
    if (item) {
      setCurrentItem(item);
      setFormData({ name: item.name, category: item.category, status: item.status, value: item.value });
    } else {
      setCurrentItem(null);
      setFormData({ name: '', category: '', status: 'Active', value: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (currentItem) {
      await crudService.updateItem(currentItem._id, formData);
      addToast(`${appConfig.resource.singular} updated successfully`, 'success');
    } else {
      await crudService.createItem(formData);
      addToast(`New ${appConfig.resource.singular} created`, 'success');
    }
    setIsModalOpen(false);
    fetchItems();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      await crudService.deleteItem(id);
      addToast(`${appConfig.resource.singular} deleted`, 'info');
      fetchItems();
    }
  };

  const filteredItems = items.filter(i => 
    i.name?.toLowerCase().includes(search.toLowerCase()) ||
    i.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {appConfig.resource.plural} Manager
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage your project dynamic database records directly.
          </p>
        </div>
        <Button onClick={() => handleOpenModal()} icon={Plus}>
          <Plus className="w-4 h-4 mr-1" /> Add {appConfig.resource.singular}
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <div className="glass-panel p-4 rounded-2xl flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder={`Search ${appConfig.resource.plural.toLowerCase()}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
        {loading ? (
          <div className="p-12 text-center flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No records found.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100/70 dark:bg-slate-900/70 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4">Value</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredItems.map((item) => (
                <tr key={item._id} className="hover:bg-slate-500/5 transition">
                  <td className="p-4 font-semibold text-slate-900 dark:text-white">{item.name}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{item.category}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-900 dark:text-white font-mono">{item.value || '$0'}</td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => handleOpenModal(item)} className="p-1.5 hover:bg-slate-800 rounded-lg text-indigo-400">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(item._id)} className="p-1.5 hover:bg-slate-800 rounded-lg text-rose-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Upsert Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentItem ? `Edit ${appConfig.resource.singular}` : `Create ${appConfig.resource.singular}`}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          />
          <Input
            label="Value / Price"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
          />
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Record</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}