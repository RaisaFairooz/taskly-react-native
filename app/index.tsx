import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  Button,
  Alert,
  TextInput,
  ScrollView,
  FlatList,
  LayoutAnimation,
} from "react-native";
import { themes } from "../themes";
import { ShoppingListItem } from "../components/ShoppingListItem";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { getFromStorage, saveToStorage } from "../utils/storage";
import * as Haptics from "expo-haptics";

type ShoppingListItemType = {
  id: string;
  name: string;
  completedAtTimestamp?: number;
  lastUpdatedTimeStamp: number;
};

const storageKey = "shopping-list";

export default function App() {
  const router = useRouter();

  const [textInputValue, setTextInputValue] = useState("");
  const [shoppingList, setShoppingList] = useState<ShoppingListItemType[]>([]);

  useEffect(() => {
    const fetchInitial = async () => {
      const data = await getFromStorage(storageKey);
      if (data) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setShoppingList(data);
      }
    };

    fetchInitial();
  }, []);

  const handleSubmit = () => {
    if (textInputValue) {
      const newShoppingList: ShoppingListItemType[] = [
        {
          id: new Date().toISOString(),
          name: textInputValue,
          lastUpdatedTimeStamp: Date.now(),
        },
        ...shoppingList,
      ];
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setShoppingList(newShoppingList);
      saveToStorage(storageKey, newShoppingList);
      setTextInputValue("");
      console.log(
        `Added ${textInputValue} to shopping list. Total items: ${newShoppingList.length}`
      );
    }
  };
  const handleDelete = (id: string) => {
    const newShoppingList = shoppingList.filter((item) => item.id !== id);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShoppingList(newShoppingList);
    saveToStorage(storageKey, newShoppingList);
  };

  const handleToggleComplete = (id: string) => {
    const newShoppingList = shoppingList.map((item) => {
      if (item.id === id) {
        if (item.completedAtTimestamp) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } else {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        return {
          ...item,
          lastUpdatedTimeStamp: Date.now(),
          completedAtTimestamp: item.completedAtTimestamp
            ? undefined
            : Date.now(),
        };
      }
      return item;
    });
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShoppingList(newShoppingList);
    saveToStorage(storageKey, newShoppingList);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={orderShoppingList(shoppingList)}
        renderItem={({ item }) => (
          <ShoppingListItem
            name={item.name}
            onDelete={() => handleDelete(item.id)}
            onToggleComplete={() => handleToggleComplete(item.id)}
            isCompleted={Boolean(item.completedAtTimestamp)}
          />
        )}
        stickyHeaderIndices={[0]}
        style={{
          backgroundColor: "#E5C9BE",
          paddingVertical: 16,
          margin: 24,
          borderRadius: 6,
        }}
        contentContainerStyle={styles.contentContainer}
        ListEmptyComponent={() => (
          <View style={styles.listEmptyContainer}>
            <Text>Your shopping list is empty.</Text>
          </View>
        )}
        ListHeaderComponent={
          <TextInput
            style={styles.textInput}
            placeholder="e.g Coffee"
            value={textInputValue}
            onChangeText={setTextInputValue}
            returnKeyType="done"
            returnKeyLabel="Add"
            onSubmitEditing={handleSubmit}
          />
        }
      />
    </View>
  );
}

function orderShoppingList(shoppingList: ShoppingListItemType[]) {
  return shoppingList.sort((item1, item2) => {
    if (item1.completedAtTimestamp && item2.completedAtTimestamp) {
      return item2.completedAtTimestamp - item1.completedAtTimestamp;
    }

    if (item1.completedAtTimestamp && !item2.completedAtTimestamp) {
      return 1;
    }

    if (!item1.completedAtTimestamp && item2.completedAtTimestamp) {
      return -1;
    }

    if (!item1.completedAtTimestamp && !item2.completedAtTimestamp) {
      return item2.lastUpdatedTimeStamp - item1.lastUpdatedTimeStamp;
    }

    return 0;
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignContent: "center",
    paddingTop: 24,
  },
  contentContainer: {
    paddingBottom: 56,
  },
  textInput: {
    borderColor: themes.colorButtonBrown,
    borderWidth: 1,
    borderRadius: 20,
    padding: 8,
    marginHorizontal: 8,
    marginBottom: 12,
    fontSize: 18,
    backgroundColor: themes.colorAnotherBGBrown,
  },
  listEmptyContainer: {
    marginVertical: 18,
    justifyContent: "center",
    alignItems: "center",
  },
});
