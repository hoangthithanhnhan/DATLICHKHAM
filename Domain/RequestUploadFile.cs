namespace DATLICHKHAM.Domain
{
    //up 1 file
    public class RequestUploadFile
    {
        public IFormFile? file { get; set; }
        public string? data { get; set; }
    }
    //up nhiều file
    public class RequestUploadMultiFile
    {
        public List<IFormFile>? files { get; set; } // => List file
        public string? data { get; set; }
    }
}
