// store/hooks.ts
// Typed hooks for Redux store - use these instead of plain useSelector/useDispatch

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// Use throughout the app instead of plain `useDispatch`
export const useAppDispatch: () => AppDispatch = useDispatch;

// Use throughout the app instead of plain `useSelector`
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
