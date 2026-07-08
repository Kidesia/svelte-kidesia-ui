import type { i18n as I18nextInstance } from 'i18next';

import de from './de.json';
import en from './en.json';

const NAMESPACE = 'ui';

type TranslationParams = Record<string, unknown>;

function interpolate(template: string, params?: TranslationParams): string {
	if (!params) return template;
	return template.replace(/\{\{(\w+)\}\}/g, (match, name: string) =>
		name in params ? String(params[name]) : match
	);
}

function lookup(resources: unknown, key: string): string | undefined {
	let node: unknown = resources;
	for (const part of key.split('.')) {
		if (typeof node !== 'object' || node === null) return undefined;
		node = (node as Record<string, unknown>)[part];
	}
	return typeof node === 'string' ? node : undefined;
}

function fallbackT(key: string, params?: TranslationParams): string {
	const template = lookup(en, key);
	return template ? interpolate(template, params) : key;
}

const i18n = $state({
	t: fallbackT,
	language: 'en'
});

/**
 * Binds the library's translation layer to the host app's i18next instance.
 * Registers the bundled `de`/`en` resources under the `ui` namespace (without
 * overwriting keys the app registered itself) and keeps the exported `i18n`
 * object in sync with the instance's language. Call this once during app
 * startup, after the instance is initialized. Without it, components fall
 * back to the bundled English strings.
 * @param instance The host app's initialized i18next instance.
 */
export function setupUiI18n(instance: I18nextInstance): void {
	instance.addResourceBundle('en', NAMESPACE, en, true, false);
	instance.addResourceBundle('de', NAMESPACE, de, true, false);
	const bind = () => {
		const fixedT = instance.getFixedT(null, NAMESPACE);
		i18n.t = (key: string, params?: TranslationParams) => fixedT(key, params);
		i18n.language = instance.language;
	};
	bind();
	instance.on('languageChanged', bind);
}

export default i18n;
