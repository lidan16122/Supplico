namespace SupplicoWebAPI.Utils
{
    public class FilesManager
    {
        static object locker = new object();
        static FilesManager intance = null;

        private FilesManager() { }

        public static FilesManager GetIntance()
        {
            if (intance == null)
            {
                lock (locker)
                {
                    if (intance == null)
                    {
                        intance = new FilesManager();
                    }

                }
            }
            return intance;
        }

        public string GetImageString(string fileName, byte[] fileBytes)
        {
            string mimeType = MimeMapping.MimeUtility.GetMimeMapping(fileName);            
            string fileData_Base64 = Convert.ToBase64String(fileBytes);
            return $"data:{mimeType};base64,{fileData_Base64}";
        }
    }
}
