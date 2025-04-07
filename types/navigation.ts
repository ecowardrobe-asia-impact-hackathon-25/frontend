export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Upload: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Wardrobe: undefined;
  MixMatch: undefined;
  Profile: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = {
  navigation: any; // Simplified for now
  route: {
    params: RootStackParamList[T];
    name: T;
  };
};

export type MainTabScreenProps<T extends keyof MainTabParamList> = {
  navigation: any; // Simplified for now
  route: {
    params: MainTabParamList[T];
    name: T;
  };
};

export type AuthStackScreenProps<T extends keyof AuthStackParamList> = {
  navigation: any; // Simplified for now
  route: {
    params: AuthStackParamList[T];
    name: T;
  };
}; 