import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Banner() {
	return (
		<>
			<Image src={'/photos/background/bg-section3.png'} width={1400} height={400} alt="bg" />
		</>
	);
}
