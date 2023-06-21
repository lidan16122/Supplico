namespace SupplicoWebAPI.DTO
{
    public class HttpFile
    {
        public byte[] FileContent;
        public string ContentType
        {
            get
            {
                if (!string.IsNullOrEmpty(FileName))
                    return MimeMapping.MimeUtility.GetMimeMapping(FileName);
                return null;
            }
        }
        public string FileName { get; set; }

        public int FileSize
        {
            get
            {
                if (FileContent != null)
                    return FileContent.Length;
                return 0;
            }
        }

        public HttpFile(byte[] fileContent, string fileName)
        {
            FileContent = fileContent;
            FileName = fileName;
        }
    }
}
