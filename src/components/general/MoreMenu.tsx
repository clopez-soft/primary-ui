/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, useRef, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import { Icon } from "@iconify/react";
import editFill from "@iconify/icons-eva/edit-fill";
import personFill from "@iconify/icons-eva/person-fill";
import trash2Outline from "@iconify/icons-eva/trash-2-outline";
import moreVerticalFill from "@iconify/icons-eva/more-vertical-fill";
import pricetagsFill from "@iconify/icons-eva/pricetags-fill";
import shoppingCartFill from "@iconify/icons-eva/shopping-cart-fill";

export type RouteParams = {
  paramName: string;
  fieldName: string;
};

const icons = {
  edit: editFill,
  delete: trash2Outline,
  more: moreVerticalFill,
  person: personFill,
  product: pricetagsFill,
  marketplace: shoppingCartFill,
};

export type MoreMenuOption = {
  useLink: boolean;
  label: string;
  route: string;
  visible: boolean;
  routeParams?: RouteParams[];
  icon: "person" | "product" | "edit" | "delete" | "more" | "marketplace";
  target?: "_blank" | "";
  onClick?: (...args: any[]) => any;
  evalVisibility?: (item: any) => boolean;
};

type UserMoreMenuProps = {
  displayOptions: MoreMenuOption[];
};

export default function UserMoreMenu({ displayOptions }: UserMoreMenuProps) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Fragment>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: "100%" },
        }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {displayOptions.map((opt) => {
          if (opt.useLink)
            return (
              <MenuItem
                key={opt.label}
                component={RouterLink}
                target={opt.target || ""}
                to={opt.route}
                sx={{ color: "text.secondary" }}
              >
                <ListItemIcon>
                  <Icon
                    icon={icons[opt.icon] || editFill}
                    width={24}
                    height={24}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={opt.label}
                  primaryTypographyProps={{ variant: "body2" }}
                />
              </MenuItem>
            );
          else
            return (
              <MenuItem
                key={opt.label}
                onClick={(event) => {
                  setIsOpen(false);
                  if (opt.onClick) opt.onClick(event);
                }}
                sx={{ color: "text.secondary" }}
              >
                <ListItemIcon>
                  <Icon
                    icon={icons[opt.icon] || trash2Outline}
                    width={24}
                    height={24}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={opt.label}
                  primaryTypographyProps={{ variant: "body2" }}
                />
              </MenuItem>
            );
        })}
      </Menu>
    </Fragment>
  );
}
