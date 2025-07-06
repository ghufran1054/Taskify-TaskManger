import Button from "./Button";
const ConfirmationDialog = ({icon, message, title, setShowConfirmDialog, handleConfirmComplete}) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  {icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                  <p className="text-gray-600 text-sm">{message}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-xl font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <Button className="flex-1"
                  onClick={handleConfirmComplete}
                  
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </div>
    ); 
}

export default ConfirmationDialog;