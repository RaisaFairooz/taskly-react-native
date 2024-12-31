import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  Pressable,
} from "react-native";
import { themes } from "../themes";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";

type ShoppingListItemProps = {
  name: string;
  isCompleted?: boolean;
  onDelete: () => void;
  onToggleComplete: () => void;
};

export function ShoppingListItem({
  name,
  isCompleted,
  onDelete,
  onToggleComplete,
}: ShoppingListItemProps) {
  return (
    <Pressable
      style={[styles.itemContainer, isCompleted && styles.completedContainer]}
      onPress={() => onToggleComplete()}
    >
      <View
        style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1 }}
      >
        <Feather
          name={isCompleted ? "check-circle" : "circle"}
          size={24}
          color={themes.colorButtonBrown}
        />
        <Text
          style={[
            styles.shoppingItemListText,
            isCompleted && styles.completedText,
          ]}
        >
          {name}
        </Text>
      </View>
      <TouchableOpacity onPress={() => onDelete()}>
        <AntDesign
          name="closecircle"
          size={24}
          color={
            isCompleted ? themes.colorInactiveButton : themes.colorRedDelete
          }
        />
      </TouchableOpacity>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignContent: "center",
  },
  shoppingItemListText: {
    color: "#594539",
    fontWeight: 700,
    alignContent: "center",
    flex: 1,
    marginBottom: 0,
    paddingBottom: 8,
  },
  itemContainer: {
    backgroundColor: themes.colorAnotherBGBrown,
    padding: 8,
    margin: 8,
    borderRadius: 8,
    borderBottomColor: themes.colorNiceDarkBlue,
    borderBottomWidth: 1,

    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: themes.colorButtonBrown,
    borderRadius: 6,
    padding: 8,
  },
  buttonTextStyle: {
    color: "#fff",
    fontWeight: "bold",
  },
  completedText: {
    textDecorationStyle: "solid",
    textDecorationLine: "line-through",
  },
  completedContainer: {
    backgroundColor: themes.colorGrayedBrown,
  },
  completedButton: {
    backgroundColor: themes.colorInactiveButton,
  },
});
