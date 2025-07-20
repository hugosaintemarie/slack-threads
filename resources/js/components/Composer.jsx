export function Composer({ placeholder }) {
    return (
        <div className="relative flex flex-col gap-3 rounded-lg border border-[#565856] bg-[#232529] px-3 py-2.5">
            <textarea
                type="text"
                placeholder={placeholder}
                className="field-sizing-content max-h-100 flex-none resize-none bg-transparent text-white placeholder-gray-400 outline-none"
            />

            {placeholder === 'Reply…' && (
                <div className="mb-1 flex cursor-pointer items-center gap-2.5 px-1">
                    <input type="checkbox" name="" id="send-in-channel" className="cursor-pointer" />
                    <label for="send-in-channel" className="mt-0.5 cursor-pointer text-xs text-[#E8E8E8B3]">
                        Also send to #support
                    </label>
                </div>
            )}

            <div className="flex items-center gap-3 text-xs text-gray-400">
                <div className="flex size-8 items-center justify-center rounded-full bg-white/10">
                    <svg className="size-4.5 fill-current" viewBox="0 0 20 20">
                        <path
                            fill="currentColor"
                            fillRule="evenodd"
                            d="M10.75 3.25a.75.75 0 0 0-1.5 0v6H3.251L3.25 10v-.75a.75.75 0 0 0 0 1.5V10v.75h6v6a.75.75 0 0 0 1.5 0v-6h6a.75.75 0 0 0 0-1.5h-6z"
                            clipRule="evenodd"
                        ></path>
                    </svg>
                </div>

                <svg viewBox="0 0 20 20" className="size-4.5 fill-current">
                    <path
                        fill="currentColor"
                        fillRule="evenodd"
                        d="M6.941 3.952c-.459-1.378-2.414-1.363-2.853.022l-4.053 12.8a.75.75 0 0 0 1.43.452l1.101-3.476h6.06l1.163 3.487a.75.75 0 1 0 1.423-.474zm1.185 8.298L5.518 4.427 3.041 12.25zm6.198-5.537a4.74 4.74 0 0 1 3.037-.081A3.74 3.74 0 0 1 20 10.208V17a.75.75 0 0 1-1.5 0v-.745a8 8 0 0 1-2.847 1.355 3 3 0 0 1-3.15-1.143C10.848 14.192 12.473 11 15.287 11H18.5v-.792c0-.984-.641-1.853-1.581-2.143a3.24 3.24 0 0 0-2.077.056l-.242.089a2.22 2.22 0 0 0-1.34 1.382l-.048.145a.75.75 0 0 1-1.423-.474l.048-.145a3.72 3.72 0 0 1 2.244-2.315zM18.5 12.5h-3.213c-1.587 0-2.504 1.801-1.57 3.085.357.491.98.717 1.572.57a6.5 6.5 0 0 0 2.47-1.223l.741-.593z"
                        clipRule="evenodd"
                    ></path>
                </svg>

                <svg viewBox="0 0 20 20" className="size-4.5 fill-current">
                    <path
                        fill="currentColor"
                        fillRule="evenodd"
                        d="M2.5 10a7.5 7.5 0 1 1 15 0 7.5 7.5 0 0 1-15 0M10 1a9 9 0 1 0 0 18 9 9 0 0 0 0-18M7.5 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M14 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m-6.385 3.766a.75.75 0 1 0-1.425.468C6.796 14.08 8.428 15 10.027 15s3.23-.92 3.838-2.766a.75.75 0 1 0-1.425-.468c-.38 1.155-1.38 1.734-2.413 1.734s-2.032-.58-2.412-1.734"
                        clipRule="evenodd"
                    ></path>
                </svg>

                <svg viewBox="0 0 20 20" className="size-4.5 fill-current">
                    <path
                        fill="currentColor"
                        fillRule="evenodd"
                        d="M2.5 10a7.5 7.5 0 1 1 15 0v.645c0 1.024-.83 1.855-1.855 1.855a1.145 1.145 0 0 1-1.145-1.145V6.75a.75.75 0 0 0-1.494-.098 4.5 4.5 0 1 0 .465 6.212A2.64 2.64 0 0 0 15.646 14 3.355 3.355 0 0 0 19 10.645V10a9 9 0 1 0-3.815 7.357.75.75 0 1 0-.865-1.225A7.5 7.5 0 0 1 2.5 10m7.5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6"
                        clipRule="evenodd"
                    ></path>
                </svg>

                <div className="h-4.5 w-px bg-white/10"></div>

                <svg viewBox="0 0 20 20" className="size-4.5 fill-current">
                    <path
                        fill="currentColor"
                        fillRule="evenodd"
                        d="M3.75 4.5a.75.75 0 0 0-.75.75v9.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-2.59a.75.75 0 0 1 1.124-.65l3.376 1.943V6.547l-3.376 1.944A.75.75 0 0 1 13 7.84V5.25a.75.75 0 0 0-.75-.75zm-2.25.75A2.25 2.25 0 0 1 3.75 3h8.5a2.25 2.25 0 0 1 2.25 2.25v1.294l2.626-1.512A1.25 1.25 0 0 1 19 6.115v7.77a1.25 1.25 0 0 1-1.874 1.083L14.5 13.456v1.294A2.25 2.25 0 0 1 12.25 17h-8.5a2.25 2.25 0 0 1-2.25-2.25z"
                        clipRule="evenodd"
                    ></path>
                </svg>

                <svg viewBox="0 0 20 20" className="size-4.5 fill-current">
                    <path
                        fill="currentColor"
                        fillRule="evenodd"
                        d="M10 2a3.5 3.5 0 0 0-3.5 3.5v3a3.5 3.5 0 1 0 7 0v-3A3.5 3.5 0 0 0 10 2M8 5.5a2 2 0 1 1 4 0v3a2 2 0 1 1-4 0zM5 8.25a.75.75 0 0 0-1.5 0v.25a6.5 6.5 0 0 0 5.75 6.457V16.5h-1.5a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-1.5v-1.543A6.5 6.5 0 0 0 16.5 8.5v-.25a.75.75 0 0 0-1.5 0v.25a5 5 0 0 1-10 0z"
                        clipRule="evenodd"
                    ></path>
                </svg>

                <svg viewBox="0 0 20 20" className="size-4.5 fill-current">
                    <path
                        fill="currentColor"
                        fillRule="evenodd"
                        d="M4.5 3h11A1.5 1.5 0 0 1 17 4.5v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 3 15.5v-11A1.5 1.5 0 0 1 4.5 3m-3 1.5a3 3 0 0 1 3-3h11a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3h-11a3 3 0 0 1-3-3zm11.64 1.391a.75.75 0 0 0-1.28-.782l-5.5 9a.75.75 0 0 0 1.28.782z"
                        clipRule="evenodd"
                    ></path>
                </svg>

                <svg viewBox="0 0 20 20" className="ml-auto size-4.5 fill-current opacity-50">
                    <path
                        fill="currentColor"
                        d="M1.5 2.25a.755.755 0 0 1 1-.71l15.596 7.808a.73.73 0 0 1 0 1.305L2.5 18.462l-.076.018a.75.75 0 0 1-.924-.728v-4.54c0-1.21.97-2.229 2.21-2.25l6.54-.17c.27-.01.75-.24.75-.79s-.5-.79-.75-.79l-6.54-.17A2.253 2.253 0 0 1 1.5 6.79z"
                    ></path>
                </svg>

                <div className="h-4.5 w-px bg-white/10"></div>

                <svg viewBox="0 0 20 20" className="size-4.5 fill-current opacity-50">
                    <path
                        fill="currentColor"
                        fillRule="evenodd"
                        d="M5.72 7.47a.75.75 0 0 1 1.06 0L10 10.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-3.75 3.75a.75.75 0 0 1-1.06 0L5.72 8.53a.75.75 0 0 1 0-1.06"
                        clipRule="evenodd"
                    ></path>
                </svg>
            </div>
        </div>
    );
}
