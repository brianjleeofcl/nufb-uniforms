import { Box, Markdown, ResponsiveContext } from 'grommet';
import React, { useContext, useEffect, useState } from 'react';
import { RespSizes } from '../grommet/utils';
import './About-page.css';

const url = 'https://gist.githubusercontent.com/brianjleeofcl/f26bfd0f02a97b061fec9588d7289eb0/raw/about.md';

export function AboutPage() {
  const size = useContext(ResponsiveContext)
  const [content ,setContent] = useState('')
  useEffect(() => {
    fetch(url)
      .then(raw => raw.text())
      .then(text => setContent(text))
  }, [])
  return <Box pad="medium" margin={size === RespSizes.S ? "" : { left: '20%', right: '20%' }}>
    <Markdown className="markdown-container">{content}</Markdown>
  </Box>
}
