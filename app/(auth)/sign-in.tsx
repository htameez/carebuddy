import { View, Text, Dimensions, Image, ActivityIndicator, TextInput } from "react-native";
import React, { useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import FormField from "@/components/FormField";
import SocialLoginButtons from "@/components/SocialLoginButtons";
import icons from "../../constants/icons";
import { Link, router } from "expo-router";
import auth from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../../backend/services/api";

const { width } = Dimensions.get("window");

const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const passwordRef = useRef<TextInput>(null);

  // ✅ Sign-in function
  const signIn = async () => {
    setLoading(true);
    try {
      const userCredential = await auth().signInWithEmailAndPassword(form.email, form.password);
      const user = userCredential.user;
  
      // ✅ Fetch User Data from MongoDB
      const userData = await api.getUser(user.uid);
  
      // ✅ Save to AsyncStorage for Quick Access
      if (userData) {
        await AsyncStorage.setItem('user', JSON.stringify(userData));
      }
  
      await AsyncStorage.setItem("onboardingCompleted", "true");
      router.replace("/home");
    } catch (e: any) {
      alert("Sign in failed: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 relative">
      <LinearGradient
        colors={["#3389BB", "rgba(35, 105, 146, 0.12)", "rgba(51, 137, 187, 0.00)"]}
        locations={[0, 0.7763, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{
          position: "absolute",
          width: 237,
          height: 544,
          top: 0,
          left: (width - 237) / 2,
        }}
      />

      <SafeAreaView className="flex-1">
        <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="w-full flex-1 justify-between items-center h-full relative px-4">
            <View className="w-full flex justify-start items-center pt-[10px]">
              <Text className="font-psemibold text-white text-[36px]">Login</Text>
              <Text className="font-iregular text-white text-[16px] pt-[4px]">
                Please Log In to Continue
              </Text>
            </View>

            <View className="w-full flex items-center justify-end gap-y-5 pb-[12%]">
              <FormField
                placeholder="Email"
                value={form.email}
                handleChangeText={(e) => setForm({ ...form, email: e })}
                otherStyles="w-[90%]"
                keyboardType="email-address"
                autoCapitalize="none"
                icon={icons.user}
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()} // ✅ Move to password field
                blurOnSubmit={false}
              />

              <FormField
                placeholder="Password"
                value={form.password}
                handleChangeText={(e) => setForm({ ...form, password: e })}
                otherStyles="w-[90%]"
                secureTextEntry
                icon={icons.lock}
                ref={passwordRef}
                returnKeyType="done"
                onSubmitEditing={signIn} // ✅ Submit on return
              />

              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <View className="w-[90%]">
                  <Text
                    onPress={signIn}
                    className="text-center text-lg font-psemibold text-white bg-primaryLight py-3 rounded-lg"
                  >
                    Log In
                  </Text>
                </View>
              )}

              <View className="flex-row items-center w-full justify-center mt-6">
                <View className="w-[21.5%] h-[1px] bg-white" />
                <Text className="text-white text-lg font-iregular mx-3">Or Log In With</Text>
                <View className="w-[21.5%] h-[1px] bg-white" />
              </View>

              <SocialLoginButtons />

              <View className="flex justify-center pt-4 flex-row gap-2">
                <Text className="text-lg text-white font-pregular">
                  Don't have an account?
                </Text>
                <Link href="/sign-up" className="text-lg font-psemibold text-white">
                  Register
                </Link>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </View>
  );
};

export default SignIn;