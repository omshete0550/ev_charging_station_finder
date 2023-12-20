import {
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  Pressable,
  ToastAndroid,
  Alert,
  Platform,
  Linking,
} from "react-native";
import React, { useEffect, useState } from "react";
import placeList from "../../app/utils/placeList.json";
import Colors from "../../app/utils/Colors";
import { FontAwesome5 } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { collection, deleteDoc, getFirestore } from "firebase/firestore";
import { app } from "../../app/utils/FirebaseConfig";
import { doc, setDoc, query, where, getDocs } from "firebase/firestore";
import { useUser } from "@clerk/clerk-expo";
import { FontAwesome } from "@expo/vector-icons";

export default function PlaceListView() {
  const db = getFirestore(app);
  const { user } = useUser();
  const [favList, setFavList] = useState([]);

  const showToast = (message) => {
    // Use Alert.alert for iOS
    Alert.alert("", message);
  };

  const onSetFav = async (place) => {
    const placeId = place.id.toString();
    await setDoc(doc(db, "ev-fav-place", placeId), {
      place,
      email: user?.primaryEmailAddress?.emailAddress,
    });
    getFav(); // Update the favorite list after marking a favorite
    // ToastAndroid.show("Fav Added", ToastAndroid.TOP);
    showToast("Fav Added");
  };

  useEffect(() => {
    user && getFav();
  }, [user]);

  const onRemoveFav = async (placeId) => {
    await deleteDoc(doc(db, "ev-fav-place", placeId.toString()));

    showToast("Fav Removed");
    getFav();
  };

  const getFav = async () => {
    setFavList([]);
    const q = query(
      collection(db, "ev-fav-place"),
      where("email", "==", user?.primaryEmailAddress?.emailAddress)
    );

    const querySnapshot = await getDocs(q);
    const updatedFavList = [];
    querySnapshot.forEach((doc) => {
      updatedFavList.push(doc.data());
    });
    setFavList(updatedFavList);
  };

  const isFav = (place) => {
    const res = favList.find((item) => item.place.id === place.id);
    return res ? true : false;
  };

  const renderFavIcon = (item) => {
    const isFavorite = isFav(item);

    return (
      <Pressable
        style={{
          position: "absolute",
          right: 0,
          margin: 5,
        }}
        onPress={() => (isFavorite ? onRemoveFav(item.id) : onSetFav(item))}
      >
        {isFavorite ? (
          <FontAwesome name="heart" size={30} color="red" />
        ) : (
          <Feather name="heart" size={30} color={Colors.PRIMARY} />
        )}
      </Pressable>
    );
  };

  const onDirectionClick = (place) => {
    const url = Platform.select({
      ios: `maps:${place?.location?.latitude},${place?.location?.longitude}?q=${place?.address}`,
      android: `geo:${place?.location?.latitude},${place?.location?.longitude}?q=${place?.address}`,
    });

    console.log(url);

    Linking.openURL(url).catch(() => {
      showToast("Unable to open maps app");
    });
  };

  return (
    <View>
      <FlatList
        data={placeList.chargingStations}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View
            key={index}
            isFav={isFav(item)}
            style={{
              width: Dimensions.get("screen").width * 0.9,
              backgroundColor: Colors.WHITE,
              margin: 5,
              borderRadius: 10,
            }}
          >
            {renderFavIcon(item)}

            <Image
              source={{ uri: item.image }}
              style={{
                width: "100%",
                borderRadius: 10,
                height: 180,
                zIndex: -1,
              }}
            />
            <View style={{ padding: 15 }}>
              <Text
                style={{
                  fontSize: 23,
                  fontFamily: "outfit-medium",
                }}
              >
                {item.name}
              </Text>
              <Text
                style={{
                  fontSize: 17,
                  fontFamily: "outfit",
                  color: Colors.GRAY,
                }}
              >
                {item.address}
              </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    marginTop: 5,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "outfit",
                      color: Colors.GRAY,
                      fontSize: 17,
                    }}
                  >
                    Connectors
                  </Text>
                  <Text
                    style={{
                      fontFamily: "outfit-medium",
                      fontSize: 20,
                      marginTop: 2,
                    }}
                  >
                    {item.connectorCount} Points
                  </Text>
                </View>
                <Pressable
                  style={{
                    padding: 12,
                    backgroundColor: Colors.PRIMARY,
                    borderRadius: 6,
                    paddingHorizontal: 14,
                  }}
                  onPress={() => onDirectionClick(item)}
                >
                  <FontAwesome5 name="location-arrow" size={25} color="white" />
                </Pressable>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}
