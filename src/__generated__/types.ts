export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  JSON: { input: any; output: any; }
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  user: User;
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  token: Scalars['String']['output'];
  user: User;
};

export type Content = {
  __typename?: 'Content';
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  slug: Scalars['String']['output'];
  status: Scalars['String']['output'];
  tenant?: Maybe<Tenant>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type CreateContentInput = {
  content: Scalars['String']['input'];
  slug: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type CreateMerchCategoryInput = {
  description?: InputMaybe<Scalars['JSON']['input']>;
  name: Scalars['JSON']['input'];
  slug: Scalars['String']['input'];
};

export type CreateMerchProductInput = {
  allowBackorder?: InputMaybe<Scalars['Boolean']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  compareAtPrice?: InputMaybe<Scalars['Float']['input']>;
  costPrice?: InputMaybe<Scalars['Float']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['JSON']['input']>;
  dimensions?: InputMaybe<Scalars['JSON']['input']>;
  featuredImage?: InputMaybe<Scalars['String']['input']>;
  hasVariants?: InputMaybe<Scalars['Boolean']['input']>;
  images?: InputMaybe<Scalars['JSON']['input']>;
  inventory?: InputMaybe<Scalars['Int']['input']>;
  isDigital?: InputMaybe<Scalars['Boolean']['input']>;
  isFeatured?: InputMaybe<Scalars['Boolean']['input']>;
  maxStock?: InputMaybe<Scalars['Int']['input']>;
  metaDescription?: InputMaybe<Scalars['JSON']['input']>;
  metaTitle?: InputMaybe<Scalars['JSON']['input']>;
  minStock?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['JSON']['input'];
  options?: InputMaybe<Scalars['JSON']['input']>;
  price: Scalars['Float']['input'];
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  searchKeywords?: InputMaybe<Scalars['JSON']['input']>;
  shortDescription?: InputMaybe<Scalars['JSON']['input']>;
  sku: Scalars['String']['input'];
  status: Scalars['String']['input'];
  tags?: InputMaybe<Scalars['JSON']['input']>;
  trackInventory?: InputMaybe<Scalars['Boolean']['input']>;
  variants?: InputMaybe<Scalars['JSON']['input']>;
  weight?: InputMaybe<Scalars['Float']['input']>;
};

export type CreateNewsArticleInput = {
  blocks: Scalars['JSON']['input'];
  byline?: InputMaybe<Scalars['JSON']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  excerpt?: InputMaybe<Scalars['JSON']['input']>;
  featuredImage?: InputMaybe<Scalars['String']['input']>;
  isBreaking?: InputMaybe<Scalars['Boolean']['input']>;
  isFeatured?: InputMaybe<Scalars['Boolean']['input']>;
  keywords?: InputMaybe<Scalars['JSON']['input']>;
  location?: InputMaybe<Scalars['JSON']['input']>;
  metaDescription?: InputMaybe<Scalars['JSON']['input']>;
  metaTitle?: InputMaybe<Scalars['JSON']['input']>;
  priority: Scalars['String']['input'];
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  scheduledAt?: InputMaybe<Scalars['DateTime']['input']>;
  slug: Scalars['String']['input'];
  socialImage?: InputMaybe<Scalars['String']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  status: Scalars['String']['input'];
  subtitle?: InputMaybe<Scalars['JSON']['input']>;
  title: Scalars['JSON']['input'];
};

export type CreateNewsCategoryInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['JSON']['input']>;
  name: Scalars['JSON']['input'];
  slug: Scalars['String']['input'];
};

export type Health = {
  __typename?: 'Health';
  status: Scalars['String']['output'];
  timestamp: Scalars['String']['output'];
  version: Scalars['String']['output'];
};

export type MerchCategory = {
  __typename?: 'MerchCategory';
  color?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['JSON']['output']>;
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['JSON']['output'];
  slug: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type MerchProduct = {
  __typename?: 'MerchProduct';
  allowBackorder?: Maybe<Scalars['Boolean']['output']>;
  category?: Maybe<MerchCategory>;
  categoryId?: Maybe<Scalars['String']['output']>;
  compareAtPrice?: Maybe<Scalars['Float']['output']>;
  costPrice?: Maybe<Scalars['Float']['output']>;
  createdAt: Scalars['DateTime']['output'];
  currency?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['JSON']['output']>;
  dimensions?: Maybe<Scalars['JSON']['output']>;
  featuredImage?: Maybe<Scalars['String']['output']>;
  hasVariants?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  images?: Maybe<Scalars['JSON']['output']>;
  inventory: Scalars['Int']['output'];
  isDigital?: Maybe<Scalars['Boolean']['output']>;
  isFeatured: Scalars['Boolean']['output'];
  maxStock?: Maybe<Scalars['Int']['output']>;
  metaDescription?: Maybe<Scalars['JSON']['output']>;
  metaTitle?: Maybe<Scalars['JSON']['output']>;
  minStock?: Maybe<Scalars['Int']['output']>;
  name: Scalars['JSON']['output'];
  options?: Maybe<Scalars['JSON']['output']>;
  price: Scalars['Float']['output'];
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  searchKeywords?: Maybe<Scalars['JSON']['output']>;
  shortDescription?: Maybe<Scalars['JSON']['output']>;
  sku: Scalars['String']['output'];
  status: Scalars['String']['output'];
  tags?: Maybe<Scalars['JSON']['output']>;
  trackInventory: Scalars['Boolean']['output'];
  updatedAt: Scalars['DateTime']['output'];
  variants?: Maybe<Scalars['JSON']['output']>;
  weight?: Maybe<Scalars['Float']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createContent: Content;
  createMerchCategory: MerchCategory;
  createMerchProduct: MerchProduct;
  createNewsArticle: NewsArticle;
  createNewsCategory: NewsCategory;
  deleteContent: Scalars['Boolean']['output'];
  deleteMerchCategory: Scalars['Boolean']['output'];
  deleteMerchProduct: Scalars['Boolean']['output'];
  deleteNewsArticle: Scalars['Boolean']['output'];
  deleteNewsCategory: Scalars['Boolean']['output'];
  login: AuthPayload;
  logout: Scalars['Boolean']['output'];
  register: AuthPayload;
  updateContent: Content;
  updateMerchCategory: MerchCategory;
  updateMerchProduct: MerchProduct;
  updateNewsArticle: NewsArticle;
  updateNewsCategory: NewsCategory;
};


export type MutationCreateContentArgs = {
  input: CreateContentInput;
};


export type MutationCreateMerchCategoryArgs = {
  input: CreateMerchCategoryInput;
};


export type MutationCreateMerchProductArgs = {
  input: CreateMerchProductInput;
};


export type MutationCreateNewsArticleArgs = {
  input: CreateNewsArticleInput;
};


export type MutationCreateNewsCategoryArgs = {
  input: CreateNewsCategoryInput;
};


export type MutationDeleteContentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteMerchCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteMerchProductArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteNewsArticleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteNewsCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationRegisterArgs = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  tenantSlug: Scalars['String']['input'];
};


export type MutationUpdateContentArgs = {
  id: Scalars['ID']['input'];
  input: UpdateContentInput;
};


export type MutationUpdateMerchCategoryArgs = {
  id: Scalars['ID']['input'];
  input: UpdateMerchCategoryInput;
};


export type MutationUpdateMerchProductArgs = {
  id: Scalars['ID']['input'];
  input: UpdateMerchProductInput;
};


export type MutationUpdateNewsArticleArgs = {
  id: Scalars['ID']['input'];
  input: UpdateNewsArticleInput;
};


export type MutationUpdateNewsCategoryArgs = {
  id: Scalars['ID']['input'];
  input: UpdateNewsCategoryInput;
};

export type NewsArticle = {
  __typename?: 'NewsArticle';
  author: User;
  blocks: Scalars['JSON']['output'];
  byline?: Maybe<Scalars['JSON']['output']>;
  category?: Maybe<NewsCategory>;
  categoryId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  excerpt?: Maybe<Scalars['JSON']['output']>;
  featuredImage?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isBreaking: Scalars['Boolean']['output'];
  isFeatured: Scalars['Boolean']['output'];
  keywords?: Maybe<Scalars['JSON']['output']>;
  location?: Maybe<Scalars['JSON']['output']>;
  metaDescription?: Maybe<Scalars['JSON']['output']>;
  metaTitle?: Maybe<Scalars['JSON']['output']>;
  priority: Scalars['String']['output'];
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  scheduledAt?: Maybe<Scalars['DateTime']['output']>;
  slug: Scalars['String']['output'];
  socialImage?: Maybe<Scalars['String']['output']>;
  source?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  subtitle?: Maybe<Scalars['JSON']['output']>;
  title: Scalars['JSON']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type NewsCategory = {
  __typename?: 'NewsCategory';
  color?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['JSON']['output']>;
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['JSON']['output'];
  slug: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type Query = {
  __typename?: 'Query';
  content: Array<Content>;
  contentById?: Maybe<Content>;
  health: Health;
  hello: Scalars['String']['output'];
  me?: Maybe<User>;
  merchCategories: Array<MerchCategory>;
  merchCategoryById?: Maybe<MerchCategory>;
  merchProductById?: Maybe<MerchProduct>;
  merchProducts: Array<MerchProduct>;
  newsArticleById?: Maybe<NewsArticle>;
  newsArticles: Array<NewsArticle>;
  newsCategories: Array<NewsCategory>;
  newsCategoryById?: Maybe<NewsCategory>;
  tenants: Array<Tenant>;
};


export type QueryContentByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMerchCategoriesArgs = {
  language?: InputMaybe<Scalars['String']['input']>;
};


export type QueryMerchCategoryByIdArgs = {
  id: Scalars['ID']['input'];
  language?: InputMaybe<Scalars['String']['input']>;
};


export type QueryMerchProductByIdArgs = {
  id: Scalars['ID']['input'];
  language?: InputMaybe<Scalars['String']['input']>;
};


export type QueryMerchProductsArgs = {
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  isFeatured?: InputMaybe<Scalars['Boolean']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryNewsArticleByIdArgs = {
  id: Scalars['ID']['input'];
  language?: InputMaybe<Scalars['String']['input']>;
};


export type QueryNewsArticlesArgs = {
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  priority?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryNewsCategoriesArgs = {
  language?: InputMaybe<Scalars['String']['input']>;
};


export type QueryNewsCategoryByIdArgs = {
  id: Scalars['ID']['input'];
  language?: InputMaybe<Scalars['String']['input']>;
};

export type Tenant = {
  __typename?: 'Tenant';
  createdAt: Scalars['DateTime']['output'];
  domain?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  slug: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type UpdateContentInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateMerchCategoryInput = {
  description?: InputMaybe<Scalars['JSON']['input']>;
  name?: InputMaybe<Scalars['JSON']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateMerchProductInput = {
  allowBackorder?: InputMaybe<Scalars['Boolean']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  compareAtPrice?: InputMaybe<Scalars['Float']['input']>;
  costPrice?: InputMaybe<Scalars['Float']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['JSON']['input']>;
  dimensions?: InputMaybe<Scalars['JSON']['input']>;
  featuredImage?: InputMaybe<Scalars['String']['input']>;
  hasVariants?: InputMaybe<Scalars['Boolean']['input']>;
  images?: InputMaybe<Scalars['JSON']['input']>;
  inventory?: InputMaybe<Scalars['Int']['input']>;
  isDigital?: InputMaybe<Scalars['Boolean']['input']>;
  isFeatured?: InputMaybe<Scalars['Boolean']['input']>;
  maxStock?: InputMaybe<Scalars['Int']['input']>;
  metaDescription?: InputMaybe<Scalars['JSON']['input']>;
  metaTitle?: InputMaybe<Scalars['JSON']['input']>;
  minStock?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['JSON']['input']>;
  options?: InputMaybe<Scalars['JSON']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  searchKeywords?: InputMaybe<Scalars['JSON']['input']>;
  shortDescription?: InputMaybe<Scalars['JSON']['input']>;
  sku?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Scalars['JSON']['input']>;
  trackInventory?: InputMaybe<Scalars['Boolean']['input']>;
  variants?: InputMaybe<Scalars['JSON']['input']>;
  weight?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateNewsArticleInput = {
  blocks?: InputMaybe<Scalars['JSON']['input']>;
  byline?: InputMaybe<Scalars['JSON']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  excerpt?: InputMaybe<Scalars['JSON']['input']>;
  featuredImage?: InputMaybe<Scalars['String']['input']>;
  isBreaking?: InputMaybe<Scalars['Boolean']['input']>;
  isFeatured?: InputMaybe<Scalars['Boolean']['input']>;
  keywords?: InputMaybe<Scalars['JSON']['input']>;
  location?: InputMaybe<Scalars['JSON']['input']>;
  metaDescription?: InputMaybe<Scalars['JSON']['input']>;
  metaTitle?: InputMaybe<Scalars['JSON']['input']>;
  priority?: InputMaybe<Scalars['String']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  scheduledAt?: InputMaybe<Scalars['DateTime']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  socialImage?: InputMaybe<Scalars['String']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  subtitle?: InputMaybe<Scalars['JSON']['input']>;
  title?: InputMaybe<Scalars['JSON']['input']>;
};

export type UpdateNewsCategoryInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['JSON']['input']>;
  name?: InputMaybe<Scalars['JSON']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type LoginMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthPayload', success: boolean, message?: string | null, user: { __typename?: 'User', id: string, email: string, firstName: string, lastName: string, isActive: boolean, createdAt: any, updatedAt: any } } };

export type RegisterMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  tenantSlug: Scalars['String']['input'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'AuthPayload', success: boolean, message?: string | null, user: { __typename?: 'User', id: string, email: string, firstName: string, lastName: string, isActive: boolean, createdAt: any, updatedAt: any } } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type CreateMerchProductMutationVariables = Exact<{
  input: CreateMerchProductInput;
}>;


export type CreateMerchProductMutation = { __typename?: 'Mutation', createMerchProduct: { __typename?: 'MerchProduct', id: string, sku: string, name: any, description?: any | null, shortDescription?: any | null, price: number, compareAtPrice?: number | null, costPrice?: number | null, currency?: string | null, inventory: number, trackInventory: boolean, allowBackorder?: boolean | null, minStock?: number | null, maxStock?: number | null, weight?: number | null, dimensions?: any | null, featuredImage?: string | null, images?: any | null, tags?: any | null, hasVariants?: boolean | null, variants?: any | null, options?: any | null, metaTitle?: any | null, metaDescription?: any | null, searchKeywords?: any | null, status: string, isFeatured: boolean, isDigital?: boolean | null, publishedAt?: any | null, createdAt: any, updatedAt: any, category?: { __typename?: 'MerchCategory', id: string, name: any, slug: string, description?: any | null } | null } };

export type UpdateMerchProductMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateMerchProductInput;
}>;


export type UpdateMerchProductMutation = { __typename?: 'Mutation', updateMerchProduct: { __typename?: 'MerchProduct', id: string, sku: string, name: any, description?: any | null, shortDescription?: any | null, price: number, compareAtPrice?: number | null, costPrice?: number | null, currency?: string | null, inventory: number, trackInventory: boolean, allowBackorder?: boolean | null, minStock?: number | null, maxStock?: number | null, weight?: number | null, dimensions?: any | null, featuredImage?: string | null, images?: any | null, tags?: any | null, hasVariants?: boolean | null, variants?: any | null, options?: any | null, metaTitle?: any | null, metaDescription?: any | null, searchKeywords?: any | null, status: string, isFeatured: boolean, isDigital?: boolean | null, publishedAt?: any | null, createdAt: any, updatedAt: any, category?: { __typename?: 'MerchCategory', id: string, name: any, slug: string, description?: any | null } | null } };

export type DeleteMerchProductMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteMerchProductMutation = { __typename?: 'Mutation', deleteMerchProduct: boolean };

export type CreateMerchCategoryMutationVariables = Exact<{
  input: CreateMerchCategoryInput;
}>;


export type CreateMerchCategoryMutation = { __typename?: 'Mutation', createMerchCategory: { __typename?: 'MerchCategory', id: string, name: any, slug: string, description?: any | null, createdAt: any, updatedAt: any } };

export type UpdateMerchCategoryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateMerchCategoryInput;
}>;


export type UpdateMerchCategoryMutation = { __typename?: 'Mutation', updateMerchCategory: { __typename?: 'MerchCategory', id: string, name: any, slug: string, description?: any | null, createdAt: any, updatedAt: any } };

export type DeleteMerchCategoryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteMerchCategoryMutation = { __typename?: 'Mutation', deleteMerchCategory: boolean };

export type CreateNewsArticleMutationVariables = Exact<{
  input: CreateNewsArticleInput;
}>;


export type CreateNewsArticleMutation = { __typename?: 'Mutation', createNewsArticle: { __typename?: 'NewsArticle', id: string, slug: string, title: any, subtitle?: any | null, excerpt?: any | null, byline?: any | null, blocks: any, featuredImage?: string | null, socialImage?: string | null, location?: any | null, source?: string | null, status: string, priority: string, isBreaking: boolean, isFeatured: boolean, metaTitle?: any | null, metaDescription?: any | null, keywords?: any | null, publishedAt?: any | null, scheduledAt?: any | null, createdAt: any, updatedAt: any, author: { __typename?: 'User', id: string, email: string, firstName: string, lastName: string }, category?: { __typename?: 'NewsCategory', id: string, name: any, slug: string, description?: any | null, color?: string | null, icon?: string | null } | null } };

export type UpdateNewsArticleMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateNewsArticleInput;
}>;


export type UpdateNewsArticleMutation = { __typename?: 'Mutation', updateNewsArticle: { __typename?: 'NewsArticle', id: string, slug: string, title: any, subtitle?: any | null, excerpt?: any | null, byline?: any | null, blocks: any, featuredImage?: string | null, socialImage?: string | null, location?: any | null, source?: string | null, status: string, priority: string, isBreaking: boolean, isFeatured: boolean, metaTitle?: any | null, metaDescription?: any | null, keywords?: any | null, publishedAt?: any | null, scheduledAt?: any | null, createdAt: any, updatedAt: any, author: { __typename?: 'User', id: string, email: string, firstName: string, lastName: string }, category?: { __typename?: 'NewsCategory', id: string, name: any, slug: string, description?: any | null, color?: string | null, icon?: string | null } | null } };

export type DeleteNewsArticleMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteNewsArticleMutation = { __typename?: 'Mutation', deleteNewsArticle: boolean };

export type CreateNewsCategoryMutationVariables = Exact<{
  input: CreateNewsCategoryInput;
}>;


export type CreateNewsCategoryMutation = { __typename?: 'Mutation', createNewsCategory: { __typename?: 'NewsCategory', id: string, name: any, slug: string, description?: any | null, color?: string | null, createdAt: any, updatedAt: any } };

export type UpdateNewsCategoryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateNewsCategoryInput;
}>;


export type UpdateNewsCategoryMutation = { __typename?: 'Mutation', updateNewsCategory: { __typename?: 'NewsCategory', id: string, name: any, slug: string, description?: any | null, color?: string | null, createdAt: any, updatedAt: any } };

export type DeleteNewsCategoryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteNewsCategoryMutation = { __typename?: 'Mutation', deleteNewsCategory: boolean };

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, email: string, firstName: string, lastName: string, isActive: boolean, createdAt: any, updatedAt: any } | null };

export type GetTenantsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTenantsQuery = { __typename?: 'Query', tenants: Array<{ __typename?: 'Tenant', id: string, name: string, slug: string, domain?: string | null, isActive: boolean, createdAt: any, updatedAt: any }> };

export type GetMerchProductsQueryVariables = Exact<{
  language?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  isFeatured?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetMerchProductsQuery = { __typename?: 'Query', merchProducts: Array<{ __typename?: 'MerchProduct', id: string, sku: string, name: any, description?: any | null, shortDescription?: any | null, price: number, compareAtPrice?: number | null, costPrice?: number | null, currency?: string | null, inventory: number, trackInventory: boolean, allowBackorder?: boolean | null, minStock?: number | null, maxStock?: number | null, weight?: number | null, dimensions?: any | null, featuredImage?: string | null, images?: any | null, tags?: any | null, hasVariants?: boolean | null, variants?: any | null, options?: any | null, metaTitle?: any | null, metaDescription?: any | null, searchKeywords?: any | null, status: string, isFeatured: boolean, isDigital?: boolean | null, publishedAt?: any | null, createdAt: any, updatedAt: any, category?: { __typename?: 'MerchCategory', id: string, name: any, slug: string, description?: any | null } | null }> };

export type GetMerchProductByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  language?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetMerchProductByIdQuery = { __typename?: 'Query', merchProductById?: { __typename?: 'MerchProduct', id: string, sku: string, name: any, description?: any | null, shortDescription?: any | null, price: number, compareAtPrice?: number | null, costPrice?: number | null, currency?: string | null, inventory: number, trackInventory: boolean, allowBackorder?: boolean | null, minStock?: number | null, maxStock?: number | null, weight?: number | null, dimensions?: any | null, featuredImage?: string | null, images?: any | null, tags?: any | null, hasVariants?: boolean | null, variants?: any | null, options?: any | null, metaTitle?: any | null, metaDescription?: any | null, searchKeywords?: any | null, status: string, isFeatured: boolean, isDigital?: boolean | null, publishedAt?: any | null, createdAt: any, updatedAt: any, category?: { __typename?: 'MerchCategory', id: string, name: any, slug: string, description?: any | null } | null } | null };

export type GetMerchCategoriesQueryVariables = Exact<{
  language?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetMerchCategoriesQuery = { __typename?: 'Query', merchCategories: Array<{ __typename?: 'MerchCategory', id: string, name: any, slug: string, description?: any | null, createdAt: any, updatedAt: any }> };

export type GetMerchCategoryByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  language?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetMerchCategoryByIdQuery = { __typename?: 'Query', merchCategoryById?: { __typename?: 'MerchCategory', id: string, name: any, slug: string, description?: any | null, createdAt: any, updatedAt: any } | null };

export type GetNewsArticlesQueryVariables = Exact<{
  language?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<Scalars['String']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetNewsArticlesQuery = { __typename?: 'Query', newsArticles: Array<{ __typename?: 'NewsArticle', id: string, slug: string, title: any, subtitle?: any | null, excerpt?: any | null, byline?: any | null, blocks: any, featuredImage?: string | null, socialImage?: string | null, location?: any | null, source?: string | null, status: string, priority: string, isBreaking: boolean, isFeatured: boolean, metaTitle?: any | null, metaDescription?: any | null, keywords?: any | null, publishedAt?: any | null, scheduledAt?: any | null, createdAt: any, updatedAt: any, author: { __typename?: 'User', id: string, email: string, firstName: string, lastName: string }, category?: { __typename?: 'NewsCategory', id: string, name: any, slug: string, description?: any | null, color?: string | null, icon?: string | null } | null }> };

export type GetNewsArticleByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  language?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetNewsArticleByIdQuery = { __typename?: 'Query', newsArticleById?: { __typename?: 'NewsArticle', id: string, slug: string, title: any, subtitle?: any | null, excerpt?: any | null, byline?: any | null, blocks: any, featuredImage?: string | null, socialImage?: string | null, location?: any | null, source?: string | null, status: string, priority: string, isBreaking: boolean, isFeatured: boolean, metaTitle?: any | null, metaDescription?: any | null, keywords?: any | null, publishedAt?: any | null, scheduledAt?: any | null, createdAt: any, updatedAt: any, author: { __typename?: 'User', id: string, email: string, firstName: string, lastName: string }, category?: { __typename?: 'NewsCategory', id: string, name: any, slug: string, description?: any | null, color?: string | null, icon?: string | null } | null } | null };

export type GetNewsCategoriesQueryVariables = Exact<{
  language?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetNewsCategoriesQuery = { __typename?: 'Query', newsCategories: Array<{ __typename?: 'NewsCategory', id: string, name: any, slug: string, description?: any | null, color?: string | null, createdAt: any, updatedAt: any }> };

export type GetNewsCategoryByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  language?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetNewsCategoryByIdQuery = { __typename?: 'Query', newsCategoryById?: { __typename?: 'NewsCategory', id: string, name: any, slug: string, description?: any | null, color?: string | null, createdAt: any, updatedAt: any } | null };
