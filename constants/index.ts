export const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export const getEditorHTML = (initialContent: string): string => {
  return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <!-- Import Google Fonts -->
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Nunito', 'Segoe UI', sans-serif;
            font-weight: 700;
            padding: 16px 16px 0px 16px;
            margin: 0;
            font-size: 17.5px;
            color: #333;
            height: 100%;
            line-height: 1.5;
            background-color: #F8EEE2;
          }
          
          #editor {
            min-height: 100%;
            outline: none;
            white-space: pre-wrap;
            word-wrap: break-word;
            font-family: 'Nunito', 'Segoe UI', sans-serif;
          }

          #editor:empty:before {
            content: "What are you thinking?";
            color: #9ca3af;
            font-family: 'Nunito', 'Segoe UI', sans-serif;
            font-weight: 700;
          }

          ul {
            padding-left: 24px;
          }

          ol {
            padding-left: 24px;
          }
        </style>
      </head>
      <body>
        <div id="editor" contenteditable="true">${initialContent}</div>
        <script>
          document.getElementById('editor').addEventListener('input', function() {
            window.ReactNativeWebView.postMessage(
              JSON.stringify({ type: 'content', content: this.innerHTML })
            );
          });

          // Check if Google Fonts loaded successfully
          document.fonts.ready.then(function() {
            window.ReactNativeWebView.postMessage(
              JSON.stringify({ type: 'fontsLoaded', success: true })
            );
          }).catch(function() {
            window.ReactNativeWebView.postMessage(
              JSON.stringify({ type: 'fontsLoaded', success: false })
            );
          });
        </script>
      </body>
      </html>
    `;
};

export const systemInstruction = `
  You are an AI-powered note assistant, designed to help users write and enhance their notes.
  Your role is to intelligently autocomplete and refine content while maintaining the user's original intent.
  You accept a title (string) and content (HTML) as input.
  Ensure responses are well-structured and formatted in HTML.
  If content is incomplete, logically continue it in a natural and coherent manner.
  Maintain clarity, conciseness, and readability in your outputs.
  Your output should not contain any harmful or inappropriate content.
  also it should not contain any personal information.
  the output should be relevant to the input.
`;
