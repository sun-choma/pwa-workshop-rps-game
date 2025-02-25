import { ComponentPropsWithoutRef } from "react";
import { ListRoot, ListItem, Text, VStack } from "@chakra-ui/react";

interface RowTitleProps extends ComponentPropsWithoutRef<typeof VStack> {
  label: string;
}

export function RowTitle({ children, label, ...props }: RowTitleProps) {
  return (
    <ListItem>
      <VStack justifyContent="space-between" py="0.5rem" {...props}>
        <Text w="full" fontSize="lg" fontWeight="medium">
          {label}
        </Text>
        <ListRoot
          variant="plain"
          w="full"
          position="relative"
          align="start"
          ml="1rem"
          _before={{
            content: "''",
            position: "absolute",
            top: "0",
            left: "0",
            width: "1px",
            bottom: "0",
            bg: "dimgray",
          }}
        >
          {children}
        </ListRoot>
      </VStack>
    </ListItem>
  );
}

export function RowItem({
  children,
  ...props
}: ComponentPropsWithoutRef<typeof ListItem>) {
  return (
    <ListItem
      display="inline"
      alignItems="center"
      position="relative"
      ml="1.5rem"
      _before={{
        content: "''",
        position: "absolute",
        top: "50%",
        borderTop: "1px solid dimgray",
        bottom: "0",
        left: "-1.5rem",
        width: "1rem",
        bg: "var(--chakra-colors-bg-panel)",
      }}
      {...props}
    >
      {children}
    </ListItem>
  );
}
