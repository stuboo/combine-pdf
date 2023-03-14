import React, { useRef } from 'react'
import { useAppDispatch } from '../../app/hooks'
import { PDF } from '../../app/types'
import { unSelectPDF } from '../ListFiles/pdfsSlice'
import { useDrag, useDrop, XYCoord } from 'react-dnd'
import { ItemTypes } from './DragItemTypes'
import type { Identifier } from 'dnd-core';

interface PDFFileItemProp {
    pdf: PDF,
    movePDF: (sourcePDF: PDF, targetPDF: PDF) => void;
}

interface DropResult {
    pdf: PDF
}

interface DragItem {
    pdf: PDF
}

const PDFFileItem = ({ pdf, movePDF } : PDFFileItemProp) => {
    const dispatch = useAppDispatch();

    const ref = useRef<HTMLDivElement>(null)
    const [{isDragging}, drag] = useDrag(() => ({
        type: ItemTypes.SELECTED_FILE,
        item: { pdf },
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
        // end: (item, monitor) => {
        //     const dropResult = monitor.getDropResult<DropResult>()
        // },
    }));


    const [{handlerId}, drop] = useDrop<DragItem, DropResult, {handlerId: Identifier | null}>(() => ({
        accept: ItemTypes.SELECTED_FILE,
        drop: () => ({ pdf }),
        collect: (monitor) => ({
            handlerId: monitor.getHandlerId()
        }),
        hover: (item: DragItem, monitor) => {
            if (!ref.current) {
                return
            }

            // Don't replace items with themselves
            if (item.pdf.filename === pdf.filename) {
                return
            }
            
            // Determine rectangle on screen
            // const hoverBoundingRect = ref.current?.getBoundingClientRect()

            // Get vertical middle
            // const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

            // Determine mouse position
            // const clientOffset = monitor.getClientOffset()

            // Get pixels to the top
            // const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

            
            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%

            // Dragging downwards: dragIndex < hoverIndex
            // if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            //     return
            // }

            // Dragging upwards: dragIndex > hoverIndex
            // if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            //     return
            // }

            // Time to actually perform the action
            movePDF(item.pdf, pdf);
            
            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            // item.pdf = pdf
        }
    }));

    drop(drag(ref));

    return (
        <div data-handler-id={handlerId} ref={ref} key={pdf.filename} className={`flex items-center mb-2 rounded justify-between p-3 bg-purple-100 ${isDragging ? 'opacity-10' : ''}`}>
            <div className={`flex w-full ml-2 items-center justify-between`}>
                <p>
                    {pdf.title}
                </p>
                <button onClick={() => dispatch(unSelectPDF(pdf))} className="flex items-center hover:text-black dark:text-gray-50 dark:hover:text-white text-gray-800 border-0 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="text-red-600 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default PDFFileItem