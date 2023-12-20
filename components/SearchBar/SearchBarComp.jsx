import { View, Text } from "react-native";
import React from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Colors from "../../app/utils/Colors";
import { Ionicons } from "@expo/vector-icons";

export default function SearchBarComp() {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        marginTop: 15,
        paddingHorizontal: 5,
        backgroundColor: Colors.WHITE,
        borderRadius: 6,
      }}
    >
      <Ionicons
        name="location"
        size={24}
        color={Colors.GRAY}
        style={{ paddingTop: 10 }}
      />
      <GooglePlacesAutocomplete
        placeholder="Search EV Charging Station"
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true`
          console.log(data, details);
        }}
        query={{
          key: "AIzaSyB9ctiAb-J9CZil_ZlpAg3Z0XpxwudHlNw",
          language: "en",
        }}
      />
    </View>
  );
}
