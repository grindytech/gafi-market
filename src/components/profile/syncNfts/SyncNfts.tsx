import {
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiDownload } from "react-icons/fi";
import { NftCollectionDto } from "../../../services/types/dtos/NftCollectionDto";
import ChooseCollection from "./ChooseCollection";
import Confirm from "./Confirm";

export default function SyncNfts({ onSuccess }: { onSuccess: () => void }) {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState<NftCollectionDto>();
  return (
    <>
      <IconButton
        title="Fetch nfts data onchain"
        onClick={onOpen}
        aria-label="fetch onchain data"
      >
        <FiDownload />
      </IconButton>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Fetch data onchain</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {step === 1 && (
              <ChooseCollection
                onChoose={(c) => {
                  setStep(2);
                  setSelected(c);
                }}
              />
            )}
            {step === 2 && (
              <Confirm
                collection={selected}
                onBack={() => {
                  setStep(1);
                }}
                onSuccess={() => {
                  setStep(1);
                  onClose();
                  setTimeout(onSuccess, 5000);
                }}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
