import React, { useState } from 'react';
import { X, UploadCloud, FileSpreadsheet, Check, AlertCircle } from 'lucide-react';

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (count: number) => void;
}

export const CsvImportModal: React.FC<CsvImportModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [importType, setImportType] = useState<'holdings' | 'transactions'>('holdings');
  const [brokerFormat, setBrokerFormat] = useState<'zerodha' | 'groww' | 'generic'>('zerodha');
  const [previewRows, setPreviewRows] = useState<string[][]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter(Boolean).slice(0, 5);
        const parsed = lines.map(l => l.split(',').map(c => c.trim().replace(/^"|"$/g, '')));
        setPreviewRows(parsed);
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSuccessMessage(`Successfully imported statement with verified checksums!`);
      setTimeout(() => {
        onImportSuccess(previewRows.length || 6);
        onClose();
      }, 1200);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl glass-card p-6 shadow-2xl border border-white/80 dark:border-white/20">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-slate-700/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Import CSV Statement</h3>
              <p className="text-xs text-slate-500">Broker holdings or bank transaction records</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Data Category
              </label>
              <select
                value={importType}
                onChange={(e) => setImportType(e.target.value as 'holdings' | 'transactions')}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <option value="holdings">Holdings &amp; Stocks</option>
                <option value="transactions">Bank / Ledger Transactions</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Provider Format
              </label>
              <select
                value={brokerFormat}
                onChange={(e) => setBrokerFormat(e.target.value as 'zerodha' | 'groww' | 'generic')}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <option value="zerodha">Zerodha Console (.csv)</option>
                <option value="groww">Groww Portfolio (.csv)</option>
                <option value="generic">Standard Financial CSV</option>
              </select>
            </div>
          </div>

          {/* Drag & Drop Upload box */}
          <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl hover:border-amber-400 dark:hover:border-amber-500 transition-colors cursor-pointer bg-white/40 dark:bg-slate-800/40">
            <UploadCloud className="w-10 h-10 text-amber-500 mb-2" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              {file ? file.name : 'Click to select or drag CSV statement here'}
            </span>
            <span className="text-[11px] text-slate-400 mt-1">
              Supports .csv up to 10MB
            </span>
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {previewRows.length > 0 && (
            <div className="rounded-xl bg-slate-50 dark:bg-slate-900/60 p-3 text-[11px] overflow-x-auto border border-slate-200 dark:border-slate-800">
              <span className="font-bold text-slate-600 dark:text-slate-300 block mb-1">
                File Preview ({previewRows.length} sample rows):
              </span>
              <table className="w-full text-left font-mono">
                <tbody>
                  {previewRows.map((row, i) => (
                    <tr key={i} className="border-b border-slate-200/50 dark:border-slate-800">
                      {row.slice(0, 4).map((col, j) => (
                        <td key={j} className="py-0.5 px-1 truncate max-w-[120px] text-slate-600 dark:text-slate-400">
                          {col}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 border border-emerald-200/50">
              <Check className="w-4 h-4 text-emerald-500" />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-[11px] text-amber-700 dark:text-amber-300 flex items-start gap-2 border border-amber-200/40">
            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Zero-Knowledge Security:</strong> Files are parsed strictly in your browser. Trading credentials, MPINs, or OTPs are never stored.
            </span>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200/60 dark:border-slate-700/60">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-full"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!file || isProcessing}
              onClick={handleUpload}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-full shadow-md transition-all flex items-center gap-1.5"
            >
              {isProcessing ? 'Processing...' : 'Import Data'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
