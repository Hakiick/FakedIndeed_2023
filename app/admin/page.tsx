import AddCompany from './AddCompany';
import EditandViewAds from './EditandViewAds';

export default function AdminPage() {
  return (
    <div>
      <div className="lg:flex">
        <div className="lg:max-w-3xl overflow-y-auto h-screen mx-4 p-2 flex-1">
          <AddCompany />
        </div>
        <hr className="h-px my-2 bg-gray-200" />
        <div className="lg:max-w-3xl overflow-y-auto h-screen mx-4 p-2 flex-1">
          <EditandViewAds />
        </div>
      </div>
      <hr className="h-px my-2 bg-gray-200" />
    </div>
  );
}
