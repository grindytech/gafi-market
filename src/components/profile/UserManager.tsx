import {
  Button,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { useQuery } from "react-query";
import { accountService } from "../../services/user.service";
import useCustomColors from "../../theme/useCustomColors";
import Avatar from "../Avatar";
import Paginator from "../Paginator";
import SearchBox from "../SearchBox";
import EditUser from "./EditUser";

export default function UserManager() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState<string>();
  const {
    data: users,
    isLoading,
    isFetching,
    refetch,
  } = useQuery([UserManager, page, search], async () => {
    const rs = await accountService.profiles({
      page,
      search,
      size: 10,
    });
    return rs.data;
  });
  const { bgColor } = useCustomColors();

  return (
    <VStack w="full">
      <TableContainer overflow="auto">
        <HStack mb={5} w="full" justifyContent="space-between">
          <Text w="full">Total {users?.total}</Text>
          <SearchBox
            inputGroupProps={{ maxW: 300 }}
            isLoading={isLoading || isFetching}
            placeHolder="Search..."
            value={search}
            onChange={(v) => {
              setPage(1);
              setSearch(v);
            }}
          />
        </HStack>
        <Table>
          <Thead>
            <Tr>
              <Th>User</Th>
              <Th>Roles</Th>
              <Th top={0} bg={bgColor} right={0} w={200} position={"sticky"}>
                Action
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {users?.items.map((u) => (
              <Tr key={`${u.id}`}>
                <Td>
                  <HStack>
                    <Avatar
                      src={u.avatar}
                      jazzicon={{
                        diameter: 42,
                        seed: u.address,
                      }}
                    />
                    <VStack alignItems="start" spacing={1}>
                      <Text>{u.name || "Unnamed"}</Text>
                      <Text color="gray.500">{u.address}</Text>
                    </VStack>
                  </HStack>
                </Td>
                <Td>{u.roles?.join(",")}</Td>
                <Td top={0} right={0} position={"sticky"} w={200} zIndex={1}>
                  <Menu>
                    <MenuButton>
                      <IconButton aria-label="menu">
                        <BsThreeDots />
                      </IconButton>
                    </MenuButton>
                    <MenuList>
                      <EditUser
                        onSuccess={() => {
                          refetch();
                        }}
                        user={u}
                      />
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <HStack mt={3} w="full" justifyContent="end">
        <Paginator
          onChange={(p) => setPage(p)}
          page={page}
          totalPage={users?.pages || 0}
        />
      </HStack>
    </VStack>
  );
}
