import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import AppMapView from '../../../components/AppMapView/AppMapView'
import Header from '../../../components/Header/Header'
import SearchBar from '../../../components/SearchBar/SearchBarComp'
import PlaceListView from '../../../components/PlaceListView/PlaceListView'

export default function HomeScreen() {
  return (
    <View>
      <View style={styles.headerContainer}>
        <Header  />
        <SearchBar />
      </View>
      <AppMapView />
      <View style={styles.placeListContainer}>
        <PlaceListView />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    zIndex: 10,
    padding: 10,
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 30
  },
  placeListContainer: {
    position: 'absolute',
    bottom: 0,
    zIndex: 10,
    width: '100%',
  }
})