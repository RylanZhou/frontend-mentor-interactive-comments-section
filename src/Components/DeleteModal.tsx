import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import ReactDOM from 'react-dom/client';

import styles from '../styles/DeleteModal.module.scss';

/**
 * The params to pass when calling delete modal using function
 */
interface ModalParams {
  onCancel: () => void;
  onDelete: () => void;
}

function createContainer() {
  const portalId = 'modal-container';

  let element = document.querySelector(`#${portalId}`);

  if (element) return element;

  element = document.createElement('div');
  element.setAttribute('id', portalId);
  document.body.appendChild(element);

  return element;
}

function DeleteModal({ confirm }: { confirm: (fn: (params: ModalParams) => void) => void }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [onDelete, setOnDelete] = useState<() => void>();
  const [onCancel, setOnCancel] = useState<() => void>();

  useEffect(() => {
    confirm((params) => {
      setModalVisible(true);
      setOnDelete(() => params.onDelete);
      setOnCancel(() => params.onCancel);
    });
  }, [confirm]);

  return createPortal(
    <div className={`${styles.DeleteModal} ${modalVisible ? styles.visible : ''}`}>
      <div className={styles.modal}>
        <div className={styles.title}>Delete Comment</div>
        <p>
          Are you sure you want to delete this comment? This will remove the comment and can&lsquo;t
          be undone.
        </p>
        <div className={styles.buttons}>
          <button
            className={styles.cancel}
            onClick={() => {
              setModalVisible(false);
              onCancel && onCancel();
            }}
          >
            No, cancel
          </button>
          <button
            className={styles.delete}
            onClick={() => {
              setModalVisible(false);
              onDelete && onDelete();
            }}
          >
            Yes, delete
          </button>
        </div>
      </div>
    </div>,
    createContainer(),
  );
}

let confirmFn: (params: ModalParams) => void;

ReactDOM.createRoot(createContainer()).render(<DeleteModal confirm={(fn) => (confirmFn = fn)} />);

export function confirm(params: ModalParams) {
  return confirmFn(params);
}
