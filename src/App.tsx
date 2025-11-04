import { useState, useEffect } from 'react';
import { Laptop, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase, LaptopModel } from './lib/supabase';
import LaptopCard from './components/LaptopCard';
import RequestModal from './components/RequestModal';

function App() {
  const [laptops, setLaptops] = useState<LaptopModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLaptop, setSelectedLaptop] = useState<LaptopModel | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchLaptops();
  }, []);

  const fetchLaptops = async () => {
    try {
      const { data, error } = await supabase
        .from('laptop_models')
        .select('*')
        .order('brand', { ascending: true });

      if (error) throw error;
      setLaptops(data || []);
    } catch (error) {
      console.error('Error fetching laptops:', error);
      showNotification('error', 'Failed to load laptop catalog');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSubmit = async (formData: { name: string; email: string; justification: string }) => {
    if (!selectedLaptop) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('laptop_requests').insert({
        laptop_model_id: selectedLaptop.id,
        requester_name: formData.name,
        requester_email: formData.email,
        business_justification: formData.justification,
      });

      if (error) throw error;

      showNotification('success', 'Request submitted successfully!');
      setSelectedLaptop(null);
    } catch (error) {
      console.error('Error submitting request:', error);
      showNotification('error', 'Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Laptop className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Laptop Catalog</h1>
              <p className="text-gray-600 mt-1">Browse and request laptops for your team</p>
            </div>
          </div>
        </div>
      </header>

      {notification && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div
            className={`flex items-center gap-3 p-4 rounded-lg ${
              notification.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <p className="font-medium">{notification.message}</p>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : laptops.length === 0 ? (
          <div className="text-center py-20">
            <Laptop className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No laptops available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {laptops.map((laptop) => (
              <LaptopCard
                key={laptop.id}
                laptop={laptop}
                onRequest={setSelectedLaptop}
              />
            ))}
          </div>
        )}
      </main>

      {selectedLaptop && (
        <RequestModal
          laptop={selectedLaptop}
          onClose={() => setSelectedLaptop(null)}
          onSubmit={handleRequestSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}

export default App;
