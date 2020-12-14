/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */







declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  UpdatePersonInput: { // input type
    email?: string | null; // String
    name?: string | null; // String
    role?: string | null; // String
  }
}

export interface NexusGenEnums {
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
}

export interface NexusGenRootTypes {
  Email: { // root type
    id?: string | null; // ID
    'rdf#type'?: string | null; // String
    'vcard#value'?: string | null; // String
  }
  Mutation: {};
  Person: { // root type
    'foaf#name'?: string | null; // String
    id?: string | null; // ID
    'vcard#hasEmail'?: NexusGenRootTypes['Email'] | null; // Email
    'vcard#role'?: string | null; // String
  }
  Query: {};
}

export interface NexusGenAllTypes extends NexusGenRootTypes {
  UpdatePersonInput: NexusGenInputs['UpdatePersonInput'];
  String: NexusGenScalars['String'];
  Int: NexusGenScalars['Int'];
  Float: NexusGenScalars['Float'];
  Boolean: NexusGenScalars['Boolean'];
  ID: NexusGenScalars['ID'];
}

export interface NexusGenFieldTypes {
  Email: { // field return type
    id: string | null; // ID
    'rdf#type': string | null; // String
    'vcard#value': string | null; // String
  }
  Mutation: { // field return type
    updatePerson: NexusGenRootTypes['Person'] | null; // Person
  }
  Person: { // field return type
    'foaf#name': string | null; // String
    id: string | null; // ID
    'vcard#hasEmail': NexusGenRootTypes['Email'] | null; // Email
    'vcard#role': string | null; // String
  }
  Query: { // field return type
    person: NexusGenRootTypes['Person'] | null; // Person
  }
}

export interface NexusGenFieldTypeNames {
  Email: { // field return type name
    id: 'ID'
    'rdf#type': 'String'
    'vcard#value': 'String'
  }
  Mutation: { // field return type name
    updatePerson: 'Person'
  }
  Person: { // field return type name
    'foaf#name': 'String'
    id: 'ID'
    'vcard#hasEmail': 'Email'
    'vcard#role': 'String'
  }
  Query: { // field return type name
    person: 'Person'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    updatePerson: { // args
      data: NexusGenInputs['UpdatePersonInput']; // UpdatePersonInput!
      webId: string; // String!
    }
  }
  Query: {
    person: { // args
      webId: string; // String!
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenInheritedFields {}

export type NexusGenObjectNames = "Email" | "Mutation" | "Person" | "Query";

export type NexusGenInputNames = "UpdatePersonInput";

export type NexusGenEnumNames = never;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = "Boolean" | "Float" | "ID" | "Int" | "String";

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: true
    resolveType: false
    __typename: false
  }
}

export interface NexusGenTypes {
  context: any;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  inheritedFields: NexusGenInheritedFields;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
}