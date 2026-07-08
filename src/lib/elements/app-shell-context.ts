import type { Snippet } from 'svelte';

export const SUB_NAVIGATION_CONTEXT = Symbol('sub-navigation');

export type SubNavigationContext = {
	register: () => () => void;
};

export const PAGE_HEADER_CONTEXT = Symbol('page-header');

export const PAGE_CRUMB_CONTEXT = Symbol('page-crumb');

export type PageCrumb = {
	label: string;
	href?: string;
};

export type PageHeader = {
	title?: string;
	subtitle?: string;
	backLink?: string;
	crumb?: PageCrumb;
	titleAdornment?: Snippet;
	offline?: boolean;
};

export type PageHeaderContext = {
	register: (header: () => PageHeader) => () => void;
};
