// Markdown Parser - Simple markdown to HTML conversion
const Markdown = {
    // Convert markdown to HTML
    parse(text) {
        if (!text) return '';
        
        let html = text;
        
        // Headers
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
        
        // Bold
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Italic
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Links
        html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
        
        // Images
        html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1">');
        
        // Unordered lists
        html = html.replace(/^\s*-\s+(.*$)/gim, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
        
        // Ordered lists
        html = html.replace(/^\s*\d+\.\s+(.*$)/gim, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/s, '<ol>$1</ol>');
        
        // Code blocks
        html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
        
        // Inline code
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // Blockquotes
        html = html.replace(/^>\s+(.*$)/gim, '<blockquote>$1</blockquote>');
        
        // Horizontal rule
        html = html.replace(/^---$/gim, '<hr>');
        
        // Line breaks
        html = html.replace(/\n/g, '<br>');
        
        return html;
    },
    
    // Parse inline markdown only (no block elements)
    parseInline(text) {
        if (!text) return '';
        
        let html = text;
        
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        return html;
    },
    
    // Convert markdown to plain text
    toPlainText(text) {
        if (!text) return '';
        
        let plain = text;
        
        // Remove markdown syntax
        plain = plain.replace(/\*\*(.*?)\*\*/g, '$1');
        plain = plain.replace(/\*(.*?)\*/g, '$1');
        plain = plain.replace(/\[(.*?)\]\((.*?)\)/g, '$1');
        plain = plain.replace(/!\[(.*?)\]\((.*?)\)/g, '$1');
        plain = plain.replace(/`([^`]+)`/g, '$1');
        plain = plain.replace(/^>\s+/gm, '');
        plain = plain.replace(/^-\s+/gm, '');
        plain = plain.replace(/^\d+\.\s+/gm, '');
        plain = plain.replace(/^#+\s+/gm, '');
        plain = plain.replace(/\n/g, ' ');
        
        return plain;
    }
};

console.log('Markdown loaded successfully');
