import React, { useState, useRef } from 'react';
import { Share, Pencil, Trash2, ExternalLink, MoreVertical } from 'lucide-react';
import { IconButton } from '../../common/buttons/IconButton';
import { useOutsideClick } from '../../../hooks/useOutsideClick';

interface SnippetCardMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  onShare: () => void;
  onOpenInNewTab: () => void;
}

const SnippetCardMenu: React.FC<SnippetCardMenuProps> = ({
  onEdit,
  onDelete,
  onShare,
  onOpenInNewTab
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useOutsideClick(dropdownRef, () => setIsDropdownOpen(false), [buttonRef]);

  return (
    <div className="top-4 right-4 flex items-center gap-1">
      {/* Primary Actions - Always Visible */}
      <IconButton
        icon={<Pencil size={16} />}
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          onEdit();
        }}
        variant="custom"
        size="sm"
        className="bg-gray-700 hover:bg-gray-600"
      />
      <IconButton
        icon={<Trash2 size={16} className="hover:text-red-500" />}
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          onDelete();
        }}
        variant="custom"
        size="sm"
        className="bg-gray-700 hover:bg-gray-600"
      />

      {/* More Actions Dropdown */}
      <div className="relative">
        <IconButton
          ref={buttonRef}
          icon={<MoreVertical size={16} />}
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            setIsDropdownOpen(!isDropdownOpen);
          }}
          variant="custom"
          size="sm"
          className="bg-gray-700 hover:bg-gray-600"
        />
        
        {isDropdownOpen && (
          <div 
            ref={dropdownRef}
            onMouseLeave={() => setIsDropdownOpen(false)}
            className="absolute right-0 top-full mt-1 w-48 bg-gray-800 rounded-md shadow-lg 
              border border-gray-700 py-1 z-50"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenInNewTab();
                setIsDropdownOpen(false);
              }}
              className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
            >
              <ExternalLink size={16} className="text-gray-400" />
              Open in new tab
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShare();
                setIsDropdownOpen(false);
              }}
              className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
            >
              <Share size={16} />
              Share snippet
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SnippetCardMenu;