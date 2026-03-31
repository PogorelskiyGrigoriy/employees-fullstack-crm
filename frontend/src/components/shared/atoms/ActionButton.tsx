/**
 * @module ActionButton
 * A standardized icon button for common CRUD actions.
 * Ensures consistent sizing, variants, and accessibility across all tables and cards.
 */
import { IconButton, type IconButtonProps } from "@chakra-ui/react";
import { LuPencil, LuTrash2, LuEye, LuEllipsisVertical } from "react-icons/lu";

// Define supported action types
type ActionType = "edit" | "delete" | "view" | "menu";

interface ActionButtonProps extends Omit<IconButtonProps, "aria-label"> {
  actionType: ActionType;
  /** Optional label for screen readers, defaults to actionType */
  label?: string;
}

const ACTION_CONFIG = {
  edit: {
    icon: <LuPencil />,
    colorPalette: "blue",
    label: "Edit item",
  },
  delete: {
    icon: <LuTrash2 />,
    colorPalette: "red",
    label: "Delete item",
  },
  view: {
    icon: <LuEye />,
    colorPalette: "gray",
    label: "View details",
  },
  menu: {
    icon: <LuEllipsisVertical />,
    colorPalette: "gray",
    label: "More actions",
  },
};

export const ActionButton = ({ actionType, label, ...props }: ActionButtonProps) => {
  const config = ACTION_CONFIG[actionType];

  return (
    <IconButton
      variant="ghost"
      size="sm"
      colorPalette={config.colorPalette}
      aria-label={label || config.label}
      {...props}
    >
      {config.icon}
    </IconButton>
  );
};