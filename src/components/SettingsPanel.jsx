export default function SettingsPanel() {
  const proxyUrl = 'https://veo3-combined-proxy.anggimh102.workers.dev/api';
  return (
    <div className="p-4 space-y-3">
      <h2 className="text-lg font-semibold">Settings</h2>
      <div className="rounded border p-3 bg-yellow-50">
        <p className="font-medium">
          API Provider: <span className="text-green-700">Proxy (locked)</span>
        </p>
        <p className="text-sm break-all">
          Proxy Base URL:&nbsp;
          <code className="bg-white px-1 py-0.5 rounded">{proxyUrl}</code>
        </p>
        <p className="text-xs text-gray-600">
          API Key tidak diperlukan. Semua request diproksikan melalui Cloudflare Worker Anda.
        </p>
      </div>
    </div>
  );
}
