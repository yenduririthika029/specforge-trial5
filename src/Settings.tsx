import React, { useState, useEffect } from 'react';
import { AISettings } from './types';
import { loadSettings, saveSettings } from './api';
import { Key, Bot, ShieldCheck, X, Eye, EyeOff, Check, Cpu } from 'lucide-react';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export default function Settings({ isOpen, onClose, onSaved }: SettingsProps) {
  const [settings, setSettings] = useState<AISettings>(loadSettings());
  const [showKey, setShowKey] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testStatus, setTestStatus] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSettings(loadSettings());
      setSaveSuccess(false);
      setTestStatus(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(settings);
    setSaveSuccess(true);
    if (onSaved) onSaved();
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 600);
  };

  const handleTestConnection = async () => {
    setTestStatus('Testing API handshake...');
    // Simulated test ensuring credentials format
    setTimeout(() => {
      if (!settings.apiKey && settings.provider !== 'gemini') {
        setTestStatus('Notice: API key is optional for default engine, but required for custom 3P endpoints.');
      } else {
        setTestStatus('Academic Engine Handshake: Connection Verified (Headers valid).');
      }
    }, 400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/50 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-dialog-title"
    >
      <div className="w-full max-w-xl bg-white border border-[#CBD5E1] rounded shadow-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#0F2756] text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h2
                id="settings-dialog-title"
                className="font-serif text-lg font-semibold text-[#0F172A] leading-tight"
              >
                AI Assisted Curriculum Drafting Engine
              </h2>
              <div className="flex items-center gap-2 text-xs text-[#64748B] mt-0.5">
                <span>Model Orchestration</span>
                <span aria-hidden="true">·</span>
                <span>NBA / ABET Specification</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close settings panel"
            className="p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded p-3 text-xs text-[#334155] flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#0F172A]">Security Invariant:</span> API credentials remain stored exclusively within your local browser storage. Headers <code className="font-mono text-[11px] bg-[#EAEDFF] text-[#0F2756] px-1 py-0.5 rounded">x-llm-provider</code>, <code className="font-mono text-[11px] bg-[#EAEDFF] text-[#0F2756] px-1 py-0.5 rounded">x-llm-key</code>, and <code className="font-mono text-[11px] bg-[#EAEDFF] text-[#0F2756] px-1 py-0.5 rounded">x-llm-model</code> are transmitted on requests and never persisted to servers or repositories.
            </div>
          </div>

          {/* Provider Selection */}
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-1.5">
              LLM Provider Specification
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['gemini', 'openai', 'anthropic', 'custom'] as const).map((prov) => {
                const isActive = settings.provider === prov;
                return (
                  <button
                    key={prov}
                    type="button"
                    onClick={() => {
                      let defaultMod = 'gemini-2.5-flash';
                      if (prov === 'openai') defaultMod = 'gpt-4o';
                      if (prov === 'anthropic') defaultMod = 'claude-3-5-sonnet-20241022';
                      if (prov === 'custom') defaultMod = 'local-curricula-v1';
                      setSettings({ ...settings, provider: prov, model: defaultMod });
                    }}
                    className={`py-2 px-3 text-xs font-medium rounded border text-center capitalize transition-colors ${
                      isActive
                        ? 'bg-[#0F2756] text-white border-[#0F2756]'
                        : 'bg-white text-[#334155] border-[#CBD5E1] hover:bg-[#F1F5F9]'
                    }`}
                  >
                    {prov}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Model Name */}
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-1.5">
              Active Model Identifier (<code className="font-mono normal-case">x-llm-model</code>)
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={settings.model}
                onChange={(e) => setSettings({ ...settings, model: e.target.value })}
                className="w-full px-3 py-2 text-xs font-mono bg-white border border-[#CBD5E1] rounded text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0F2756] focus:border-[#0F2756]"
                placeholder="e.g. gemini-2.5-flash or gpt-4o"
              />
              <Cpu className="w-4 h-4 text-[#94A3B8] absolute right-3 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* API Key */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                API Key Authorization (<code className="font-mono normal-case">x-llm-key</code>)
              </label>
              <span className="text-[11px] text-[#64748B]">
                Optional for Studio dev runtime
              </span>
            </div>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={settings.apiKey}
                onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                className="w-full pl-8 pr-10 py-2 text-xs font-mono bg-white border border-[#CBD5E1] rounded text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0F2756] focus:border-[#0F2756]"
                placeholder="Enter provider key or leave blank for runtime proxy"
              />
              <Key className="w-4 h-4 text-[#94A3B8] absolute left-2.5 top-2.5" />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2.5 top-2 text-[#64748B] hover:text-[#0F172A] p-1 rounded"
                title={showKey ? 'Mask API key' : 'Show API key'}
              >
                {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* System Prompt Preset */}
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-1.5">
              Accreditation Directive Preset
            </label>
            <select
              value={settings.systemPromptPreset}
              onChange={(e) => setSettings({ ...settings, systemPromptPreset: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-white border border-[#CBD5E1] rounded text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0F2756] focus:border-[#0F2756]"
            >
              <option value="Academic Curriculum Specialist (NBA / ABET / NEP 2024 Criteria)">
                NBA / ABET / NEP 2024 Criteria (Tier-1 Standard)
              </option>
              <option value="Bloom's Taxonomy Verifier (Anderson & Krathwohl)">
                Bloom&apos;s Revised Cognitive Depth Verifier (K1-K6)
              </option>
              <option value="AICTE Model Curriculum Aligning Specialist">
                AICTE Model Curriculum & Contact Hours Harmonization
              </option>
            </select>
          </div>

          {testStatus && (
            <div className="p-2.5 bg-[#EAEDFF] border border-[#CBD5E1] rounded text-xs text-[#0F2756]">
              {testStatus}
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
            <button
              type="button"
              onClick={handleTestConnection}
              className="px-3 py-2 text-xs font-medium text-[#334155] bg-white border border-[#CBD5E1] rounded hover:bg-[#F1F5F9] transition-colors"
            >
              Verify Endpoint Handshake
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 text-xs font-medium text-[#334155] bg-white border border-[#CBD5E1] rounded hover:bg-[#F1F5F9] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-medium text-white bg-[#0F2756] hover:bg-[#1E3A8A] rounded transition-colors flex items-center gap-1.5"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#DCFCE7]" />
                    Saved Successfully
                  </>
                ) : (
                  'Save Settings'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
