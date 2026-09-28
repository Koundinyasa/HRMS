import { useState } from "react";

export function useStoreTemplateFilter() {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isCategoryOpen, setCategoryOpen] = useState(false);

  const toggleCategoryDropdown = () => setCategoryOpen((p) => !p);
  const closeCategoryDropdown = () => setCategoryOpen(false);

  const handleCategoryChange = (values: string[]) => {
    setSelectedCategories(values);
  };

  const handleCategoryClear = () => {
    setSelectedCategories([]);
  };

  return {
    search,
    setSearch,
    selectedCategories,
    isCategoryOpen,
    toggleCategoryDropdown,
    closeCategoryDropdown,
    handleCategoryChange,
    handleCategoryClear,
  };
}