export const ngFormToFormData = (ngFormData: any) => {
  const formData = new FormData();

  for (const key in ngFormData) {
    if (!Object.prototype.hasOwnProperty.call(ngFormData, key)) {
      continue;
    }

    formData.append(key, ngFormData[key]);
  }

  return formData;
}
