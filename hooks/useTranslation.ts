import { useCallback } from 'react';

import { useAppStore } from '@/store/useAppStore';
import { translate, TranslationKey } from '@/utils/i18n';

export function useTranslation() {
  const language = useAppStore((state) => state.language);

  const t = useCallback(
    (key: TranslationKey, values?: Record<string, string | number>) => translate(language, key, values),
    [language]
  );

  return { t, language };
}
