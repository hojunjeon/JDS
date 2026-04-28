import { buildBossWarningView, buildQuestToastView } from './runtimeOverlay';

let activeAlert: HTMLElement | null = null;

export function showQuestToast(input: { title: string; dialogue: string; rewardText: string }): void {
  const view = buildQuestToastView(input);
  showAlert(`
    <section class="jds-runtime-alert toast">
      <div class="label">${view.heading}</div>
      <strong>${view.body}</strong>
      <p>${view.dialogue}</p>
      <small>${view.detail}</small>
    </section>
  `, 2100);
}

export function showBossWarning(input: { name: string; dialogue: string }): void {
  const view = buildBossWarningView(input);
  showAlert(`
    <section class="jds-runtime-alert boss">
      <div class="label">${view.heading}</div>
      <h1>${view.name}</h1>
      <code>${view.detail}</code>
    </section>
  `, 2300);
}

export function clearRuntimeAlert(): void {
  activeAlert?.remove();
  activeAlert = null;
}

function showAlert(html: string, durationMs: number): void {
  clearRuntimeAlert();
  const root = document.createElement('div');
  root.className = 'jds-runtime-alert-root';
  root.innerHTML = html;
  document.body.append(root);
  activeAlert = root;
  window.setTimeout(() => {
    if (activeAlert === root) clearRuntimeAlert();
  }, durationMs);
}
