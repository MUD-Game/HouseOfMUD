/**
 * @module useRefSize
 * @description Hook to get the size of an element
 * @category React Hooks
 */

import { useLayoutEffect, useState } from 'react';

export function useRefSize(ref: any) {
    const [size, setSize] = useState(ref.current ? [ref.current.clientWidth, ref.current.clientHeight]: [0,0]);
    useLayoutEffect(() => {
        function updateSize() {
            setSize([ref.current.clientWidth, ref.current.clientHeight]);
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, [ref]);
    return size;
}