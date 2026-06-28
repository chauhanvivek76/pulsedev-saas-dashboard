import { useState, useEffect } from 'react';
import { Save, AlertCircle, Cpu, BellRing } from 'lucide-react';
import { apiService } from '../services/api';
import { useLogger } from '../hooks/useLogger';
import { useToast } from '../components/common/Toast';
import Card, { CardHeader, CardContent, CardFooter } from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

export const Settings = () => {
  const { logInfo, logSubmit, logError } = useLogger('SettingsPage');
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState({
    developerName: 'Alex Mercer',
    cpuAlertThreshold: '80',
    memoryAlertThreshold: '85',
    slackWebhook: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    logInfo('Settings page rendered');
  }, [logInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errors = {};
    const cpuVal = parseInt(formData.cpuAlertThreshold, 10);
    const memVal = parseInt(formData.memoryAlertThreshold, 10);

    if (!formData.developerName.trim()) {
      errors.developerName = 'Developer display name is required';
    }

    if (isNaN(cpuVal) || cpuVal < 10 || cpuVal > 100) {
      errors.cpuAlertThreshold = 'CPU Alert threshold must be a number between 10 and 100';
    }

    if (isNaN(memVal) || memVal < 10 || memVal > 100) {
      errors.memoryAlertThreshold = 'Memory Alert threshold must be a number between 10 and 100';
    }

    if (formData.slackWebhook) {
      try {
        new URL(formData.slackWebhook);
      } catch {
        errors.slackWebhook = 'Please enter a valid slack webhook URL';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    logSubmit('Telemetry Alert Settings Form', formData);

    if (!validate()) {
      toastError('Settings validation failed');
      return;
    }

    setSaving(true);
    try {
      await apiService.updateSettings(formData);
      success('Settings updated successfully!');
    } catch (err) {
      logError('Failed to save settings', err);
      toastError('Failed to save configuration settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-slate-200 dark:border-slate-900 pb-4 select-none">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Settings</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Configure server threshold limits and notification parameters.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main settings options */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader
                title="General Console Settings"
                description="Manage telemetry settings and local display preferences."
              />
              <CardContent className="space-y-4">
                <Input
                  label="Developer Name"
                  name="developerName"
                  value={formData.developerName}
                  onChange={handleChange}
                  error={formErrors.developerName}
                  required
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader
                title="Alert Metrics Thresholds"
                description="Trigger alerts and logs when node telemetry spikes past limits."
              />
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="CPU Alert Limit (%)"
                    name="cpuAlertThreshold"
                    type="number"
                    value={formData.cpuAlertThreshold}
                    onChange={handleChange}
                    error={formErrors.cpuAlertThreshold}
                    icon={Cpu}
                    required
                  />

                  <Input
                    label="Memory Alert Limit (%)"
                    name="memoryAlertThreshold"
                    type="number"
                    value={formData.memoryAlertThreshold}
                    onChange={handleChange}
                    error={formErrors.memoryAlertThreshold}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader
                title="Slack Webhook Integrations"
                description="Send warning logs and panic messages directly to Slack channels."
              />
              <CardContent className="space-y-4">
                <Input
                  label="Incoming Slack URL"
                  name="slackWebhook"
                  placeholder="https://hooks.slack.com/services/..."
                  value={formData.slackWebhook}
                  onChange={handleChange}
                  error={formErrors.slackWebhook}
                />
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  isLoading={saving}
                  icon={Save}
                >
                  Save Settings
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Sidebar Tips card */}
          <div className="space-y-6 select-none">
            <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-slate-900 dark:to-slate-900 border-indigo-200/50 dark:border-slate-800">
              <CardHeader
                title="Developer Recommendations"
                icon={BellRing}
                className="border-none pb-0"
              />
              <CardContent className="space-y-4 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                <div className="flex items-start gap-2.5">
                  <AlertCircle size={16} className="text-indigo-650 mt-0.5 shrink-0" />
                  <p>
                    Threshold limits automatically trigger warning logs in our telemetry logs console when monitored statistics cross boundaries.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <AlertCircle size={16} className="text-indigo-650 mt-0.5 shrink-0" />
                  <p>
                    Ensure your Slack webhook matches standard JSON structures to avoid channel rejection log events.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Settings;
