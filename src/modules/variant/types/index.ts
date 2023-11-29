export interface SetAtributeOptionToUpdateVariant {
  id?: string;
  variantId: string;
  atribute?: string;
  atributeOption?: string;
}

export interface UpdatedVariantToProduct {
  variantId: string;
  imageUrl?: string;
  set?: SetAtributeOptionToUpdateVariant[];
}
