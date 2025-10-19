import { StyleSheet } from "react-native";
import COLORS from "../../constants/colors";

const styles = StyleSheet.create({
    modalContent: {
        flex: 1,
        marginTop: 80,
        backgroundColor: COLORS.cardBackground,
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: "hidden",
    },
    title: {
        fontSize: 20,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 16,
        color: COLORS.textDark,
    },
    noComments: {
        textAlign: "center",
        color: COLORS.textSecondary,
        marginTop: 20,
        fontSize: 16,
    },
    comment: {
        backgroundColor: COLORS.inputBackground,
        borderRadius: 12,
        padding: 12,
        marginVertical: 6,
    },
    user: {
        fontWeight: "600",
        fontSize: 14,
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    commentText: {
        fontSize: 16,
        color: COLORS.black,
        marginBottom: 6,
    },
    commentTime: {
        fontSize: 12,
        color: COLORS.textSecondary,
        textAlign: "right",
    },
    closeButton: {
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        backgroundColor: COLORS.primary,
        alignItems: "center",
    },
    closeText: {
        fontSize: 16,
        fontWeight: "500",
        color: COLORS.white,
    },
});
export default styles