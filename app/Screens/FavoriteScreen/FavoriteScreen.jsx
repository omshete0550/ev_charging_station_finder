import {
  Platform,
  Linking,
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Image,
  Alert,
  Pressable,
} from "react-native";

import React, { useEffect, useState } from "react";
import Colors from "../../utils/Colors";
import { app } from "../../utils/FirebaseConfig";
import {
  collection,
  getFirestore,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useUser } from "@clerk/clerk-expo";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

export default function FavoriteScreen() {
  const db = getFirestore(app);
  const { user } = useUser();
  const [favList, setFavList] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    user && getFav();
  }, [user]);

  const showToast = (message) => {
    // Use Alert.alert for iOS
    Alert.alert("", message);
  };

  const getFav = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "ev-fav-place"),
        where("email", "==", user?.primaryEmailAddress?.emailAddress)
      );

      const querySnapshot = await getDocs(q);
      const updatedFavList = [];
      querySnapshot.forEach((doc) => {
        // console.log(doc.id);
        updatedFavList.push(doc.data());
        setLoading(false);
      });
      setFavList(updatedFavList);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
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

  const onRemoveFav = async (placeId) => {
    await deleteDoc(doc(db, "ev-fav-place", placeId.toString()));

    showToast("Fav Removed");
    getFav();
  };

  const onDirectionClick = (place) => {
    const url = Platform.select({
      ios: `maps:${place?.location?.latitude},${place?.location?.longitude}?q=${place?.address}`,
      android: `geo:${place?.location?.latitude},${place?.location?.longitude}?q=${place?.address}`,
    });

    // console.log(url);

    Linking.openURL(url).catch(() => {
      showToast("Unable to open maps app");
    });
  };

  // console.log(favList);

  return (
    <View>
      <Text
        style={{
          fontFamily: "outfit-bold",
          fontSize: 30,
          textAlign: "center",
          // marginLeft: 15,
          marginTop: 40,
          marginBottom: 20,
        }}
      >
        My Favorite <Text style={{ color: Colors.PRIMARY }}>Places</Text>
      </Text>
      {!favList ? (
        <View
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "5em",
          }}
        >
          <ActivityIndicator size={"large"} color={Colors.PRIMARY} />
          <Text
            style={{
              fontFamily: "outfit",
              marginTop: 5,
            }}
          >
            Loading..
          </Text>
        </View>
      ) : null}

      <FlatList
        data={favList}
        onRefresh={() => getFav()}
        refreshing={loading}
        renderItem={({ item, index }) => (
          <View
            key={index}
            isFav={isFav(item)}
            style={{
              width: Dimensions.get("screen").width * 0.9,
              backgroundColor: Colors.WHITE,
              margin: 5,
              borderRadius: 10,
              marginLeft: 20,
            }}
          >
            {renderFavIcon(item.place)}

            <Image
              source={{ uri: item.place.image }}
              style={{
                width: "100%",
                borderRadius: 10,
                height: 180,
                zIndex: -1,
              }}
            />
            <View style={{ padding: 15 }}>
              {console.log("Item:", item)}
              <Text style={{ fontSize: 23, fontFamily: "outfit-medium" }}>
                {item.place.name}
              </Text>

              <Text
                style={{
                  fontSize: 17,
                  fontFamily: "outfit",
                  color: Colors.GRAY,
                }}
              >
                {item.place.address}
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
                    {item.place.connectorCount} Points
                  </Text>
                </View>
                <Pressable
                  style={{
                    padding: 12,
                    backgroundColor: Colors.PRIMARY,
                    borderRadius: 6,
                    paddingHorizontal: 14,
                  }}
                  onPress={() => onDirectionClick(item.place)}
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
