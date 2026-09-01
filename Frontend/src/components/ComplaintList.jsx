import { useEffect, useState } from 'react';
import { fetchComplaints, upvoteComplaint } from '../api/services';

export default function ComplaintList() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      const { data } = await fetchComplaints();
      setComplaints(data);
    } catch (err) {
      console.error('Failed to load complaints', err);
    }
  };

  const handleUpvote = async (id) => {
    try {
      await upvoteComplaint(id);
      loadComplaints(); // Refresh list to reflect updated votes & priority
    } catch (err) {
      alert(err.response?.data?.message || 'Upvote failed');
    }
  };

  return (
    <div className="p-4 space-y-4">
      {complaints.map((item) => (
        <div key={item._id} className="border p-4 rounded shadow-sm">
          <h3 className="font-bold text-lg">{item.title}</h3>
          <p>{item.description}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm bg-gray-100 px-2 py-1 rounded">Priority: {item.priority}</span>
            <button 
              onClick={() => handleUpvote(item._id)}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Upvote ({item.upvotes})
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}