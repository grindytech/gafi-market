import {
  HStack,
  Table,
  TableContainer,
  Tbody,
  Tfoot,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useQuery } from "react-query";
import { accountService } from "../../services/user.service";

export default function UserManage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState<string>();
  const { data } = useQuery(["UserManage", page, search], async () => {
    const rs = accountService.profileByAddress
  });
  return (
    <VStack>
      <HStack></HStack>
      <TableContainer>
        <Table variant="simple"></Table>
        <Tbody></Tbody>
        <Tfoot></Tfoot>
      </TableContainer>
    </VStack>
  );
}
