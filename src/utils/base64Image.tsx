import React from "react";
import Image from "next/image";

interface Base64ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

const Base64Image = ({
  src,
  alt,
  width = 500,
  height = 300,
  className,
}: Base64ImageProps) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      unoptimized
    />
  );
};

export default Base64Image;
