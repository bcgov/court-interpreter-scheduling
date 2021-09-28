import React, { useState, useEffect } from 'react';
import { getLanguageNames } from 'util/apiHelper';
import AutocompleteInput from 'components/form/inputs/Autocomplete';

export function AutoCompleteLanguage({
  name,
  initialValue,
}: {
  name: string;
  initialValue?: string;
}) {
  const [languages, setLanguages] = useState<string[]>(['Loading ...']);
  const [initValue, setInitValue] = useState<string | undefined>(initialValue);
  useEffect(() => {
    async function fetchLanguages() {
      const langs = await getLanguageNames();
      const filteredInitValue = langs.filter(
        (lang) => lang.toLowerCase() === initialValue?.toLocaleLowerCase()
      );
      if (filteredInitValue.length > 0) {
        setInitValue(filteredInitValue[0]);
      }
      setLanguages(langs);
    }
    fetchLanguages();
  }, [setLanguages, setInitValue, initialValue]);
  return (
    <AutocompleteInput
      fieldName={name}
      options={languages}
      initialValue={initValue}
    />
  );
}
