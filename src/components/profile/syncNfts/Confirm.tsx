import { Button, HStack, VStack } from "@chakra-ui/react";
import { useState } from "react";
import useSwal from "../../../hooks/useSwal";
import nftService from "../../../services/nft.service";
import { NftCollectionDto } from "../../../services/types/dtos/NftCollectionDto";
import NftCollectionCard from "../../collections/NftCollectionCard";
import PrimaryButton from "../../PrimaryButton";
import CollectionItems from "./CollectionItems";

export default function Confirm({
  collection,
  onSuccess,
  onBack,
}: {
  collection: NftCollectionDto;
  onSuccess: () => void;
  onBack: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const { swAlert } = useSwal();
  const confirmHandle = async () => {
    try {
      setLoading(true);
      await nftService.fetchNftsOnchain(collection.id);
      onSuccess();
      swAlert({
        title: "Successfully",
        icon: "success",
        text: "Metadata might need some minutes to fetch",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <VStack w="full">
      <CollectionItems active collection={collection} />
      <HStack justifyContent="end" w="full">
        <Button disabled={loading} onClick={onBack}>
          Back
        </Button>
        <PrimaryButton
          isLoading={loading}
          disabled={loading}
          onClick={confirmHandle}
        >
          Confirm
        </PrimaryButton>
      </HStack>
    </VStack>
  );
}
