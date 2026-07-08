import { createInstance } from 'i18next';
import { describe, expect, it } from 'vitest';

import i18n, { setupUiI18n } from './index.svelte';

describe('ui i18n', () => {
	it('falls back to bundled English before setup', () => {
		expect(i18n.t('common.retry')).toBe('Retry');
		expect(i18n.t('common.showingNOfTotal', { n: 3, total: 9 })).toContain('3');
	});

	it('binds to a host i18next instance with the ui namespace', async () => {
		const instance = createInstance();
		await instance.init({ lng: 'de', fallbackLng: 'en', resources: {} });
		setupUiI18n(instance);
		expect(i18n.language).toBe('de');
		expect(i18n.t('common.retry')).toBe('Erneut versuchen');
	});
});
