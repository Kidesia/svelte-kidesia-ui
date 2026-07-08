export type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export interface PersistedState<T> {
	value: T;
}

function useStorage<T>(storage: StorageLike, key: string, initialValue: T): PersistedState<T> {
	const persistedValue = storage.getItem(key);
	const state = persistedValue ? JSON.parse(persistedValue) : initialValue;

	let storedValue = $state(state);

	return {
		get value() {
			return storedValue;
		},
		set value(newValue: T) {
			storedValue = newValue;
			storage.setItem(key, JSON.stringify(newValue));
		}
	};
}

/**
 * Persist a value across page refreshes and browser sessions.
 * @param key Storage key the value is saved under.
 * @param initialValue Value used when nothing is persisted yet.
 * @param storage Backing store; defaults to `localStorage`. Pass a custom
 * `StorageLike` to scope or namespace the persistence.
 * @returns A reactive `value` accessor backed by the store.
 */
export function usePersistedState<T>(
	key: string,
	initialValue: T,
	storage: StorageLike = localStorage
): PersistedState<T> {
	return useStorage(storage, key, initialValue);
}

/**
 * Persist a value for the duration of the current browser tab session.
 * @param key Storage key the value is saved under.
 * @param initialValue Value used when nothing is persisted yet.
 * @param storage Backing store; defaults to `sessionStorage`.
 * @returns A reactive `value` accessor backed by the store.
 */
export function useSessionState<T>(
	key: string,
	initialValue: T,
	storage: StorageLike = sessionStorage
): PersistedState<T> {
	return useStorage(storage, key, initialValue);
}
