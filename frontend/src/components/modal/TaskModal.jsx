import { DownloadCloud } from 'lucide-react';
import moment from 'moment';

export default function TaskModal({
  task,
  onClose,
  onDone,
  downloadAttachment,
  status,
}) {
  if (!task) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 border-b border-black">
          {task.title}
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-6">{task.description}</p>
        <p className="text-gray-600 mb-6">
          Deadline : {moment(task.deadline).format('YYYY-MM-DD')}
        </p>

        <div>
          {task?.attachments?.length > 0 && (
            <div>
              <button
                className="flex gap-2 cursor-pointer border rounded p-2 shadow"
                onClick={() => downloadAttachment(task)}
              >
                <span>Download Attachment</span>
                <DownloadCloud size={28} />
              </button>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
          >
            Close
          </button>
          <button
            onClick={() => onDone(task._id)}
            className={`px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 ${
              status === 'done' ? 'hidden' : ''
            }`}
          >
            {status === 'todo'
              ? 'Start Doing'
              : status === 'in-progress'
              ? 'Done'
              : ''}
          </button>
        </div>
      </div>
    </div>
  );
}
